---
description: Sync project documentation to jb-cloud-docs (docs.jbcloud.app). Creates or updates project docs in the documentation site.
---

# JB Docs Sync Command

Syncs the current project's documentation to the jb-cloud-docs repository.

## Usage

```
/jbdocs              # Sync current project
/jbdocs init         # Initial setup for new project
/jbdocs update       # Update existing docs
/jbdocs progress     # Update progress only
/jbdocs commands     # Sync commands reference to docs

# New flags (Phase 1)
/jbdocs --dry-run    # Preview changes without applying
/jbdocs --fix        # Auto-fix validation issues
/jbdocs update --dry-run  # Preview update
```

## Arguments

Parse `$ARGUMENTS` for mode:
- `init` - Full initial documentation setup
- `update` - Update existing docs
- `progress` - Update progress.md only
- `commands` - Generate commands reference page

## Flags

Parse `$ARGUMENTS` for flags:
- `--dry-run` - Preview changes without committing or pushing (can combine with any mode)
- `--fix` - Auto-fix validation issues (missing frontmatter, broken code blocks)

## What This Command Does

1. **Identifies the current project** from CLAUDE.md or directory name
2. **Gathers documentation** from the project directory
3. **Creates/updates docs** in `/Users/jb/jb-cloud-docs/src/content/docs/{project-slug}/`
4. **Commits and pushes** to the jb-cloud-docs repository

---

## Execution Steps

### Step 1: Identify Project

Read the current working directory and gather:
- Project name (from CLAUDE.md or directory name)
- Project slug (kebab-case version)
- Project description
- Tech stack
- **Source project path** (absolute path to current project)

If CLAUDE.md doesn't exist, ask user for project name and description.

### Step 1.5: Conflict Detection

**Before creating or updating docs, check for slug conflicts:**

```bash
# Check if slug directory exists
if [ -d "/Users/jb/jb-cloud-docs/src/content/docs/{project-slug}" ]; then
  # Read existing index.md frontmatter
  existing_source=$(grep -A1 'source_project:' "/Users/jb/jb-cloud-docs/src/content/docs/{project-slug}/index.md" | tail -1 | tr -d ' ')
fi
```

**Conflict scenarios:**

1. **Slug exists, same source project** - OK to update (normal flow)
2. **Slug exists, different source project** - WARN and offer alternatives:
   ```
   WARNING: Slug '{project-slug}' already exists for a different project.

   Existing: /Users/jb/Sites/other-project
   Current:  /Users/jb/Sites/this-project

   Options:
   1. Use alternative slug: {project-slug}-2
   2. Update existing (will overwrite)
   3. Cancel operation
   ```
3. **Slug exists, no source_project field** - Legacy docs, offer to claim with warning

### Step 2: Check Mode and Flags

Parse flags from `$ARGUMENTS`:
- Check for `--dry-run` flag
- Check for `--fix` flag

Determine what to sync based on argument or context:

**init** (or new project):
- Create project directory
- Generate full documentation set
- index.md, architecture.md, plan.md

**update** (default for existing):
- Check what files changed
- Update corresponding docs
- Preserve existing content structure

**progress**:
- Update only progress.md
- Add session accomplishments
- Update "last modified" dates

### Step 2.5: Dry-Run Preview (if --dry-run flag)

If `--dry-run` is set, collect all planned changes and display preview:

```
[DRY RUN] Would sync: {project-name}

Files:
  - index.md: CREATE
  - architecture.md: UPDATE (source modified 2h ago)
  - plan.md: SKIP (no changes)
  - progress.md: CREATE

Sidebar: Would add entry to astro.config.mjs
Git: Would commit "docs({project-slug}): {action} documentation"

Source project: {source-path}
Target: /Users/jb/jb-cloud-docs/src/content/docs/{project-slug}/

Run without --dry-run to execute.
```

**After displaying preview, STOP execution.** Do not proceed to subsequent steps.

### Step 3: Gather Source Documentation

Look for documentation in the project:

```
{project}/
├── CLAUDE.md              → Context and decisions
├── docs/
│   ├── ARCHITECTURE.md    → System design
│   ├── PLAN.md            → Implementation plan
│   └── *.md               → Feature docs
├── package.json           → Tech stack
└── README.md              → Overview
```

### Step 4: Generate Documentation

Use the **jbdocs** agent (Task tool with subagent_type from agents/jbdocs.md) to:

1. Create the project directory if needed:
   ```bash
   mkdir -p /Users/jb/jb-cloud-docs/src/content/docs/{project-slug}
   ```

2. Generate/update documentation files with proper Starlight frontmatter

3. Ensure all markdown is valid and links work

### Step 5: Register in Sidebar (CRITICAL)

**This step prevents orphaned documentation pages.**

Check if the project section exists in `astro.config.mjs` sidebar config:

```bash
grep -q "directory: '{project-slug}'" /Users/jb/jb-cloud-docs/astro.config.mjs
```

If NOT found, add the section to the sidebar array in `astro.config.mjs`:

```javascript
{
  label: '{Project Name}',
  autogenerate: { directory: '{project-slug}' },
},
```

Insert it alphabetically among other project sections (after "Bricks Builder Agent", before "UI Resources").

**Example addition:**
```javascript
// In astro.config.mjs sidebar array, add:
{
  label: 'Env Var Assistant',
  autogenerate: { directory: 'env-var-assistant' },
},
```

### Step 5.5: Pre-Commit Validation

**Validate all documentation files before committing:**

Required checks:
1. **Frontmatter validation**
   - Must have `title` (required)
   - Must have `description` (required)
   - Must have `source_project` in index.md (required for conflict detection)
   - `sidebar.order` should be numeric

2. **Markdown validation**
   - No broken internal links (links to files that don't exist)
   - Code blocks must have language tags (```js, ```bash, etc.)
   - Tables must be properly formatted

3. **Content validation**
   - No placeholder text like `{project-name}` left unreplaced
   - No empty sections

**If `--fix` flag is set, auto-correct:**
- Add missing `description` from first paragraph
- Add language tags to code blocks (default to `text`)
- Remove empty sections

**Validation output:**
```
Validating documentation...

index.md: PASS
architecture.md: WARN - Code block at line 45 missing language tag
plan.md: PASS
progress.md: ERROR - Missing required 'description' in frontmatter

Errors: 1, Warnings: 1

Use --fix to auto-correct issues.
```

**If errors found without --fix flag, STOP and report. Do not commit invalid docs.**

### Step 6: Commit and Push

```bash
cd /Users/jb/jb-cloud-docs
git add src/content/docs/{project-slug}/ astro.config.mjs
git commit -m "docs({project-slug}): {action} documentation"
git push origin main
```

### Step 7: Verify Deployment (with Retry Logic)

Verify deployment with exponential backoff (3 attempts):

```bash
verify_deployment() {
  local url="https://docs.jbcloud.app/{project-slug}/"
  local max_attempts=3
  local attempt=1

  while [ $attempt -le $max_attempts ]; do
    echo "Checking deployment (attempt $attempt/$max_attempts)..."
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")

    if [ "$status" = "200" ]; then
      echo "Deployment verified: $url"
      return 0
    fi

    if [ $attempt -lt $max_attempts ]; then
      delay=$((30 * attempt))  # 30s, 60s, 120s
      echo "Got $status, retrying in ${delay}s..."
      sleep $delay
    fi

    attempt=$((attempt + 1))
  done

  return 1
}

verify_deployment
```

**Retry schedule:**
- Attempt 1: Immediate
- Attempt 2: Wait 30 seconds
- Attempt 3: Wait 60 seconds

**On final failure (after 3 attempts):**
```
Deployment verification incomplete after 3 attempts.

The docs were committed and pushed successfully, but the live site
hasn't updated yet. This can happen during heavy traffic.

Manual verification:
  curl -I https://docs.jbcloud.app/{project-slug}/

Or check Cloudflare Pages dashboard:
  https://dash.cloudflare.com/

The commit is live in the repository - deployment will complete shortly.
```

**Do NOT fail the entire command on verification timeout - the commit succeeded.**

### Step 8: Report Success

Display to user:
```
Documentation synced to jb-cloud-docs

Project: {project-name}
Slug: {project-slug}
Files:
  - index.md (created/updated)
  - architecture.md (created/updated)
  - plan.md (created/updated)

View at: https://docs.jbcloud.app/{project-slug}/

Commit: {commit-hash}
```

---

## Integration with /new-project

When `/new-project` Phase 1 asks "Document to docs.jbcloud.app?" and user says Yes:

1. Store `documentToDocs: true` in project context
2. After Phase 6 (Scaffolding), automatically run `/jbdocs init`
3. Include docs sync in Phase 7 handoff message

---

## Integration with /end

When `/end` runs on a project with docs sync enabled:

1. Check if project has existing docs in jb-cloud-docs
2. Run `/jbdocs progress` to update progress
3. Include sync status in session summary

---

## Troubleshooting

### "jb-cloud-docs not found"
```bash
# Clone the repository
cd /Users/jb
git clone https://github.com/Aventerica89/jb-cloud-docs.git
```

### "Push failed"
```bash
cd /Users/jb/jb-cloud-docs
git pull --rebase origin main
git push origin main
```

### "Project slug already exists"
The command will update existing docs. Use `init` argument only for truly new projects.

### "Slug conflict detected"
If a different project already uses this slug:
1. Use the suggested alternative slug (e.g., `my-project-2`)
2. Or update the existing docs if you own that project
3. Check `source_project` in existing index.md frontmatter

### "Validation failed"
Run with `--fix` flag to auto-correct common issues:
```bash
/jbdocs --fix
```

Or manually fix the reported issues before re-running.

---

## Manual Usage Examples

### New Project
```
# After creating a new project
cd ~/Sites/my-new-app
/jbdocs init
```

### After Making Changes
```
# Updated architecture or added features
/jbdocs update
```

### End of Session
```
# Quick progress update
/jbdocs progress
```

### Sync Commands Reference
```
# Update the commands documentation
/jbdocs commands
```

---

## Commands Mode (`/jbdocs commands`)

Generates a commands reference page from all available commands.

### Workflow

1. **Scan commands directory**
   ```bash
   ls ~/.claude/commands/*.md
   ```

2. **Extract metadata** from each command file:
   - Filename → command name
   - Frontmatter `description` → brief description
   - Content → detailed documentation

3. **Generate commands.md**

   Location: `/Users/jb/jb-cloud-docs/src/content/docs/claude-code/commands.md`

   ```markdown
   ---
   title: Available Commands
   description: Reference for all Claude Code slash commands
   sidebar:
     order: 1
   ---

   ## Development

   | Command | Description |
   |---------|-------------|
   | /tdd | Test-driven development workflow |
   | /plan | Create implementation plan |
   ...
   ```

4. **Commit and push**
   ```bash
   cd /Users/jb/jb-cloud-docs
   mkdir -p src/content/docs/claude-code
   git add src/content/docs/claude-code/
   git commit -m "docs(claude-code): update commands reference"
   git push origin main
   ```

### Command Categories

Group commands by category:

| Category | Commands |
|----------|----------|
| Development | /tdd, /plan, /code-review, /fix-issue |
| Git & Workflow | /commit, /standup |
| Session | /context-save, /context-restore, /end, /remind |
| Quality | /deploy-check, /deps-audit, /security-review |
| Documentation | /jbdocs, /update-docs |
| Project | /new-project |

### Output

```
Commands reference synced to jb-cloud-docs

Generated: src/content/docs/claude-code/commands.md
Commands documented: 15
Categories: 6

View at: https://docs.jbcloud.app/claude-code/commands/
```
