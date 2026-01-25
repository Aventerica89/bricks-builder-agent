# Claude Code Configuration Architecture

**Freshness:** 2026-01-25T11:30:00Z

## Overview

Personal Claude Code configuration with agents, rules, skills, commands, hooks, and domain-specific knowledge bases.

## Directory Structure

```
~/.claude/
├── CLAUDE.md              # User-level config (global settings)
├── agents/                # 10 specialized subagents
├── rules/                 # 8 always-active guidelines  
├── skills/                # 12 workflow/domain skills
├── commands/              # 16 slash commands
├── hooks/                 # Automation triggers
├── scripts/               # Cross-platform Node.js scripts
├── contexts/              # Dynamic prompt injection
├── knowledge/             # Domain knowledge bases
├── projects/              # Project-specific configs
├── examples/              # Reference templates
├── mcp-configs/           # MCP server configurations
├── codemaps/              # This documentation
└── .reports/              # Generated reports
```

## Component Relationships

```
User Input
    │
    ▼
┌─────────────────────────────────────────────────────┐
│                    CLAUDE.md                        │
│              (Global User Config)                   │
└─────────────────────────────────────────────────────┘
    │
    ├──────────────────┬──────────────────┐
    ▼                  ▼                  ▼
┌─────────┐      ┌─────────┐        ┌─────────┐
│  Rules  │      │ Contexts│        │  Hooks  │
│ (Always)│      │(Dynamic)│        │(Trigger)│
└─────────┘      └─────────┘        └─────────┘
    │                  │                  │
    └──────────────────┼──────────────────┘
                       ▼
              ┌───────────────┐
              │   Commands    │
              │  (/ triggers) │
              └───────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
    ┌─────────┐  ┌─────────┐  ┌─────────┐
    │ Agents  │  │ Skills  │  │Knowledge│
    │(Delegate│  │(Workflow│  │ (Domain │
    │  Tasks) │  │ Guides) │  │  Data)  │
    └─────────┘  └─────────┘  └─────────┘
```

## Data Flow

1. **User Config** (`CLAUDE.md`) - Global preferences loaded at session start
2. **Rules** - Always-active guidelines (security, style, testing, etc.)
3. **Contexts** - Injected based on mode (dev, review, research)
4. **Commands** - User-triggered workflows via `/command`
5. **Agents** - Specialized subagents for delegated tasks
6. **Skills** - Domain knowledge and workflow patterns
7. **Knowledge** - Project-specific reference data (e.g., Bricks Builder)
8. **Hooks** - Automated triggers (session lifecycle, compaction)

## Key Integration Points

| Component | Triggers | Outputs |
|-----------|----------|---------|
| Commands | `/slash` invocation | Agent delegation, file changes |
| Agents | Task tool delegation | Analysis, code, reports |
| Hooks | Session events | State persistence, suggestions |
| Skills | Command/Agent reference | Workflow guidance |
| Knowledge | Agent/Skill reference | Domain-specific patterns |
