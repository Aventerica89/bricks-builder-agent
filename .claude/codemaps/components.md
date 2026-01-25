# Claude Code Components Reference

**Freshness:** 2026-01-25T11:30:00Z

## Agents (10)

Specialized subagents for task delegation via Task tool.

| Agent | Purpose | Trigger |
|-------|---------|---------|
| `architect` | System design, scalability decisions | Complex architecture |
| `planner` | Feature implementation planning | `/plan` or complex tasks |
| `tdd-guide` | Test-driven development workflow | `/tdd` |
| `code-reviewer` | Quality, security, maintainability | After code changes |
| `security-reviewer` | Vulnerability detection (OWASP) | Security-sensitive code |
| `build-error-resolver` | Build/TypeScript error fixing | Build failures |
| `e2e-runner` | Playwright E2E testing | `/e2e` |
| `refactor-cleaner` | Dead code cleanup | `/refactor-clean` |
| `doc-updater` | Documentation sync | `/update-docs` |
| `bricks-builder` | Screenshot → Bricks JSON | Custom domain agent |

## Rules (8)

Always-active guidelines in `~/.claude/rules/`.

| Rule | Scope |
|------|-------|
| `agents.md` | When to delegate to subagents |
| `coding-style.md` | Formatting, immutability, organization |
| `git-workflow.md` | Commit format, PR process |
| `hooks.md` | Git hooks, automation |
| `patterns.md` | Design patterns, best practices |
| `performance.md` | Model selection, context management |
| `security.md` | Security best practices |
| `testing.md` | TDD, 80% coverage requirement |

## Commands (16)

Slash commands in `~/.claude/commands/`.

| Command | Purpose |
|---------|---------|
| `/tdd` | Test-driven development |
| `/plan` | Implementation planning |
| `/e2e` | E2E test generation |
| `/code-review` | Quality review |
| `/build-fix` | Fix build errors |
| `/refactor-clean` | Dead code removal |
| `/learn` | Extract patterns mid-session |
| `/checkpoint` | Save verification state |
| `/verify` | Run verification loop |
| `/setup-pm` | Configure package manager |
| `/eval` | Evaluation harness |
| `/orchestrate` | Multi-agent orchestration |
| `/test-coverage` | Test coverage analysis |
| `/update-codemaps` | Update architecture docs |
| `/update-docs` | Update documentation |

## Skills (12)

Workflow definitions in `~/.claude/skills/`.

| Skill | Domain |
|-------|--------|
| `coding-standards/` | Language best practices |
| `backend-patterns/` | API, database, caching |
| `frontend-patterns/` | React, Next.js patterns |
| `tdd-workflow/` | TDD methodology |
| `security-review/` | Security checklist |
| `continuous-learning/` | Pattern extraction |
| `strategic-compact/` | Compaction suggestions |
| `eval-harness/` | Verification evaluation |
| `verification-loop/` | Continuous verification |
| `clickhouse-io/` | ClickHouse patterns |
| `project-guidelines-example/` | Template for project configs |
| `learned/` | Auto-extracted patterns |

## Contexts (3)

Dynamic prompt injection in `~/.claude/contexts/`.

| Context | Mode |
|---------|------|
| `dev.md` | Development mode |
| `review.md` | Code review mode |
| `research.md` | Research/exploration mode |

## Hooks

Automation triggers in `~/.claude/hooks/`.

```
hooks/
├── hooks.json              # Hook configuration
├── memory-persistence/     # Session lifecycle
│   ├── session-start.sh
│   ├── session-end.sh
│   └── pre-compact.sh
└── strategic-compact/      # Compaction suggestions
    └── suggest-compact.sh
```

## Scripts

Cross-platform Node.js scripts in `~/.claude/scripts/`.

```
scripts/
├── lib/
│   ├── utils.js            # File/path utilities
│   └── package-manager.js  # PM detection
├── hooks/
│   ├── session-start.js
│   ├── session-end.js
│   ├── pre-compact.js
│   ├── suggest-compact.js
│   └── evaluate-session.js
└── setup-package-manager.js
```

## Knowledge Bases

Domain-specific reference data in `~/.claude/knowledge/`.

```
knowledge/
└── bricks/                 # Bricks Builder domain
    ├── 00-quick-reference.md
    ├── 01-json-structure.md
    ├── 02-acss-variables.md
    ├── 03-responsive-patterns.md
    ├── elements/           # Element specifications
    │   ├── layout.md
    │   ├── content.md
    │   ├── interactive.md
    │   └── advanced.md
    └── patterns/           # JSON examples
        ├── hero-centered.json
        ├── hero-split.json
        ├── header-nav.json
        ├── card-grid.json
        ├── gallery-header.json
        ├── feature-section.json
        ├── contact-section.json
        ├── content-section.json
        └── footer.json
```

## Projects

Project-specific configurations in `~/.claude/projects/`.

```
projects/
└── bricks-builder/
    └── GUIDELINES.md       # Project guidelines
```
