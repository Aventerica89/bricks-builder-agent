# Bricks Builder Agent Workflow

**Extracted:** 2026-01-25
**Context:** Building an AI agent that converts screenshots to Bricks Builder JSON with ACSS variables

## Problem

Converting web design screenshots into valid Bricks Builder JSON is tedious and error-prone. Need a systematic approach that:
- Produces valid, importable JSON
- Uses ACSS variables consistently
- Follows Frames methodology (BEM classes on every element)
- Learns from corrections to improve over time

## Solution

### Project Structure

```
~/.claude/
├── agents/
│   └── bricks-builder.md           # Main agent definition
├── knowledge/
│   └── bricks/
│       ├── 00-quick-reference.md
│       ├── 01-json-structure.md
│       ├── 02-acss-variables.md
│       ├── elements/               # Element-specific docs
│       └── patterns/               # Reusable JSON patterns
├── skills/
│   └── learned/                    # Patterns learned from corrections
├── projects/
│   └── bricks-builder/
│       ├── GUIDELINES.md           # Master reference
│       ├── campaigns/              # Per-client settings
│       │   └── smith/
│       │       ├── acss-settings.json
│       │       ├── ACTIVE-SETTINGS.md
│       │       └── sections/
│       └── scripts/
│           └── validate-bricks-json.js
```

### Workflow

1. **Setup Campaign** - Import client's ACSS settings, identify active/disabled features
2. **Analyze Screenshot** - Identify layout structure, components, spacing
3. **Generate JSON** - Use patterns from knowledge base, apply ACSS variables
4. **Validate** - Run validation script to check JSON integrity
5. **Iterate** - User tests in Bricks, provides corrections
6. **Learn** - Extract patterns from corrections using `/learn`
7. **Document** - Update GUIDELINES.md and create skill files

### Key Patterns Learned

1. **Every element needs a class** - No exceptions, follows Frames methodology
2. **Images as elements, not CSS backgrounds** - Better accessibility, SEO
3. **Nested grids for asymmetric layouts** - Separate column wrappers with different row ratios
4. **Split backgrounds** - Absolute positioned hidden divs with container overlay
5. **CSS custom variables in global classes** - Define in `_cssCustom`

### Validation Script

`validate-bricks-json.js` checks:
- JSON schema compliance
- ID uniqueness (6-char alphanumeric)
- Parent-child relationship integrity
- Global class cross-references

## When to Use

- Starting a new Bricks Builder project
- Converting screenshots to JSON
- Learning from user corrections
- Validating JSON before import

## Repository

https://github.com/Aventerica89/bricks-builder-agent.git
