//
//  SafariWebExtensionHandler.swift
//  Env Var Assistant Extension
//
//  Handles native messaging between Safari extension and 1Password CLI
//

import SafariServices
import os.log

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    private let opPath = "/opt/homebrew/bin/op"

    func beginRequest(with context: NSExtensionContext) {
        let request = context.inputItems.first as? NSExtensionItem

        let message = extractMessage(from: request)
        os_log(.default, "Received message: %{public}@", String(describing: message))

        guard let dict = message as? [String: Any],
              let action = dict["action"] as? String else {
            sendError(context: context, error: "Invalid message format")
            return
        }

        do {
            let result = try handleAction(action: action, params: dict)
            sendSuccess(context: context, data: result)
        } catch {
            sendError(context: context, error: error.localizedDescription)
        }
    }

    // MARK: - Message Handling

    private func extractMessage(from request: NSExtensionItem?) -> Any? {
        if #available(macOS 11.0, *) {
            return request?.userInfo?[SFExtensionMessageKey]
        } else {
            return request?.userInfo?["message"]
        }
    }

    private func sendSuccess(context: NSExtensionContext, data: Any) {
        let response = NSExtensionItem()
        let responseData: [String: Any] = ["success": true, "data": data]

        if #available(macOS 11.0, *) {
            response.userInfo = [SFExtensionMessageKey: responseData]
        } else {
            response.userInfo = ["message": responseData]
        }

        context.completeRequest(returningItems: [response], completionHandler: nil)
    }

    private func sendError(context: NSExtensionContext, error: String) {
        let response = NSExtensionItem()
        let responseData: [String: Any] = ["success": false, "error": error]

        if #available(macOS 11.0, *) {
            response.userInfo = [SFExtensionMessageKey: responseData]
        } else {
            response.userInfo = ["message": responseData]
        }

        context.completeRequest(returningItems: [response], completionHandler: nil)
    }

    // MARK: - Action Handlers

    private func handleAction(action: String, params: [String: Any]) throws -> Any {
        switch action {
        case "ping":
            return ["pong": true]

        case "check":
            return try checkOp()

        case "list":
            let vault = params["vault"] as? String
            let tags = params["tags"] as? [String]
            return try listItems(vault: vault, tags: tags)

        case "read":
            guard let reference = params["reference"] as? String else {
                throw OpError.missingParameter("reference")
            }
            return try readSecret(reference: reference)

        case "create":
            return try createApiCredential(params: params)

        case "get":
            guard let itemId = params["itemId"] as? String else {
                throw OpError.missingParameter("itemId")
            }
            let vault = params["vault"] as? String
            return try getItem(itemId: itemId, vault: vault)

        case "search":
            let query = params["query"] as? String
            let vault = params["vault"] as? String
            let tags = params["tags"] as? [String]
            return try searchItems(query: query, vault: vault, tags: tags)

        case "updateField":
            guard let itemId = params["itemId"] as? String,
                  let fieldName = params["fieldName"] as? String,
                  let fieldValue = params["fieldValue"] as? String else {
                throw OpError.missingParameter("itemId, fieldName, or fieldValue")
            }
            let vault = params["vault"] as? String
            let section = params["section"] as? String
            return try updateItemField(itemId: itemId, fieldName: fieldName, fieldValue: fieldValue, vault: vault, section: section)

        default:
            throw OpError.unknownAction(action)
        }
    }

    // MARK: - 1Password CLI Operations

    private func checkOp() throws -> [String: Any] {
        let version = try runOp(args: ["--version"])
        // Verify authentication by listing vaults
        _ = try runOp(args: ["vault", "list", "--format=json"])
        return ["version": version.trimmingCharacters(in: .whitespacesAndNewlines), "authenticated": true]
    }

    private func listItems(vault: String?, tags: [String]?) throws -> [[String: Any]] {
        var args = ["item", "list", "--format=json"]

        if let vault = vault {
            args.append("--vault=\(vault)")
        }

        if let tags = tags, !tags.isEmpty {
            args.append("--tags=\(tags.joined(separator: ","))")
        }

        let result = try runOp(args: args)

        guard !result.isEmpty else {
            return []
        }

        guard let data = result.data(using: .utf8),
              let items = try JSONSerialization.jsonObject(with: data) as? [[String: Any]] else {
            return []
        }

        return items.map { item in
            let id = item["id"] as? String ?? ""
            let title = item["title"] as? String ?? ""
            let vaultInfo = item["vault"] as? [String: Any]
            let vaultName = vaultInfo?["name"] as? String ?? "Private"
            let category = item["category"] as? String ?? ""

            return [
                "id": id,
                "title": title,
                "vault": vaultName,
                "category": category,
                "reference": "op://\(vaultName)/\(title)/credential"
            ]
        }
    }

    private func readSecret(reference: String) throws -> String {
        return try runOp(args: ["read", reference]).trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private func createApiCredential(params: [String: Any]) throws -> [String: Any] {
        guard let title = params["title"] as? String,
              let credential = params["credential"] as? String else {
            throw OpError.missingParameter("title or credential")
        }

        var args = ["item", "create", "--category=API Credential", "--title=\(title)"]

        if let vault = params["vault"] as? String {
            args.append("--vault=\(vault)")
        }

        if let tags = params["tags"] as? [String], !tags.isEmpty {
            args.append("--tags=\(tags.joined(separator: ","))")
        }

        args.append("credential=\(credential)")

        if let dashboardUrl = params["dashboardUrl"] as? String {
            args.append("dashboard_url=\(dashboardUrl)")
        }

        if let sourceUrl = params["sourceUrl"] as? String,
           let url = URL(string: sourceUrl),
           ["http", "https"].contains(url.scheme) {
            args.append("source_url=\(sourceUrl)")
        }

        if let envVarName = params["envVarName"] as? String {
            args.append("env_var_name=\(envVarName)")
        }

        if let project = params["project"] as? String {
            let sanitized = project.replacingOccurrences(of: "[^a-zA-Z0-9_-]", with: "", options: .regularExpression)
            if !sanitized.isEmpty {
                args.append("project=\(sanitized)")
            }
        }

        args.append("--format=json")

        let result = try runOp(args: args)

        guard let data = result.data(using: .utf8),
              let item = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            throw OpError.parseError("Failed to parse create response")
        }

        let id = item["id"] as? String ?? ""
        let itemTitle = item["title"] as? String ?? title
        let vaultInfo = item["vault"] as? [String: Any]
        let vaultName = vaultInfo?["name"] as? String

        return ["id": id, "title": itemTitle, "vault": vaultName ?? "Private"]
    }

    private func getItem(itemId: String, vault: String?) throws -> [String: Any] {
        // Validate itemId format
        let pattern = "^[a-zA-Z0-9-]+$"
        guard itemId.range(of: pattern, options: .regularExpression) != nil else {
            throw OpError.invalidParameter("Invalid item ID format")
        }

        var args = ["item", "get", itemId, "--format=json"]

        if let vault = vault {
            args.append("--vault=\(vault)")
        }

        let result = try runOp(args: args)

        guard let data = result.data(using: .utf8),
              let item = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            throw OpError.parseError("Failed to parse item")
        }

        return item
    }

    private func searchItems(query: String?, vault: String?, tags: [String]?) throws -> [[String: Any]] {
        var args = ["item", "list", "--format=json"]

        if let vault = vault {
            args.append("--vault=\(vault)")
        }

        if let tags = tags, !tags.isEmpty {
            args.append("--tags=\(tags.joined(separator: ","))")
        }

        let result = try runOp(args: args)

        guard !result.isEmpty else {
            return []
        }

        guard let data = result.data(using: .utf8),
              var items = try JSONSerialization.jsonObject(with: data) as? [[String: Any]] else {
            return []
        }

        // Filter by query if provided
        if let query = query, !query.isEmpty {
            let lowercaseQuery = query.lowercased()
            items = items.filter { item in
                let title = (item["title"] as? String ?? "").lowercased()
                return title.contains(lowercaseQuery)
            }
        }

        return items.map { item in
            [
                "id": item["id"] as? String ?? "",
                "title": item["title"] as? String ?? "",
                "vault": (item["vault"] as? [String: Any])?["name"] as? String ?? "",
                "category": item["category"] as? String ?? "",
                "tags": item["tags"] as? [String] ?? []
            ]
        }
    }

    private func updateItemField(itemId: String, fieldName: String, fieldValue: String, vault: String?, section: String?) throws -> [String: Any] {
        // Validate itemId
        guard itemId.range(of: "^[a-zA-Z0-9-]+$", options: .regularExpression) != nil else {
            throw OpError.invalidParameter("Invalid item ID format")
        }

        // Validate fieldName
        guard fieldName.range(of: "^[a-zA-Z][a-zA-Z0-9_-]*$", options: .regularExpression) != nil else {
            throw OpError.invalidParameter("Invalid field name format")
        }

        var args = ["item", "edit", itemId]

        if let vault = vault {
            args.append("--vault=\(vault)")
        }

        let fieldPath = section != nil ? "\(section!).\(fieldName)" : fieldName
        args.append("\(fieldPath)=\(fieldValue)")
        args.append("--format=json")

        let result = try runOp(args: args)

        guard let data = result.data(using: .utf8),
              let item = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            throw OpError.parseError("Failed to parse update response")
        }

        return [
            "id": item["id"] as? String ?? "",
            "title": item["title"] as? String ?? "",
            "vault": (item["vault"] as? [String: Any])?["name"] as? String ?? ""
        ]
    }

    // MARK: - CLI Execution

    private func runOp(args: [String]) throws -> String {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: opPath)
        process.arguments = args

        let outputPipe = Pipe()
        let errorPipe = Pipe()
        process.standardOutput = outputPipe
        process.standardError = errorPipe

        try process.run()
        process.waitUntilExit()

        let outputData = outputPipe.fileHandleForReading.readDataToEndOfFile()
        let errorData = errorPipe.fileHandleForReading.readDataToEndOfFile()

        if process.terminationStatus != 0 {
            let errorMessage = String(data: errorData, encoding: .utf8) ?? "Unknown error"
            throw OpError.cliError(errorMessage.trimmingCharacters(in: .whitespacesAndNewlines))
        }

        return String(data: outputData, encoding: .utf8) ?? ""
    }
}

// MARK: - Error Types

enum OpError: LocalizedError {
    case unknownAction(String)
    case missingParameter(String)
    case invalidParameter(String)
    case parseError(String)
    case cliError(String)

    var errorDescription: String? {
        switch self {
        case .unknownAction(let action):
            return "Unknown action: \(action)"
        case .missingParameter(let param):
            return "Missing parameter: \(param)"
        case .invalidParameter(let msg):
            return "Invalid parameter: \(msg)"
        case .parseError(let msg):
            return "Parse error: \(msg)"
        case .cliError(let msg):
            return msg
        }
    }
}
