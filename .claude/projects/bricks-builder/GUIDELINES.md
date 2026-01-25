# Bricks Builder AI Agent - Project Guidelines

## Overview

AI agent that converts screenshots of web sections into valid Bricks Builder JSON with AutomaticCSS (ACSS) variables and BEM-named global classes.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Input                               │
│  Screenshot + Description                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Bricks Builder Agent                       │
│  ~/.claude/agents/bricks-builder.md                        │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ Knowledge│   │ Learned  │   │ Pattern  │
        │   Base   │   │  Skills  │   │ Examples │
        └──────────┘   └──────────┘   └──────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    JSON Output                              │
│  Copy-paste ready for Bricks Builder                       │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
~/.claude/
├── agents/
│   └── bricks-builder.md           # Main agent definition
├── knowledge/
│   └── bricks/
│       ├── 00-quick-reference.md   # Fast lookup patterns
│       ├── 01-json-structure.md    # JSON format reference
│       ├── 02-acss-variables.md    # ACSS variables + breakout classes
│       ├── 03-responsive-patterns.md
│       ├── elements/
│       │   ├── layout.md           # section, container, block, div
│       │   ├── content.md          # heading, text, image, video, icon
│       │   ├── interactive.md      # button, nav, form, accordion
│       │   └── advanced.md         # slider, gallery, query loops
│       └── patterns/
│           ├── hero-centered.json
│           ├── hero-split.json
│           ├── header-nav.json
│           ├── card-grid.json
│           └── ...
├── skills/
│   └── learned/
│       ├── frames-acss-naming-patterns.md
│       └── frames-custom-css-patterns.md
└── projects/
    └── bricks-builder/
        └── GUIDELINES.md           # This file
```

---

## JSON Output Format

Every output must include:

```json
{
  "content": [...],
  "source": "bricksCopiedElements",
  "sourceUrl": "https://example.com",
  "version": "2.1.4",
  "globalClasses": [...]
}
```

### Element Structure

```json
{
  "id": "abc123",
  "name": "element-type",
  "parent": "parent-id-or-0",
  "children": ["child-id-1", "child-id-2"],
  "settings": {...},
  "label": "Human Readable Label"
}
```

### ID Rules

- 6 lowercase alphanumeric characters
- Format: `[a-z0-9]{6}`
- Examples: `sec001`, `hdr42x`, `img7b2`
- NEVER reuse IDs within output

---

## BEM Naming Convention

### Class Prefix Options

Use `jb` as default prefix. If conflicts arise, use US state abbreviations:

| Prefix | State | Use Case |
|--------|-------|----------|
| `jb` | Default | Standard projects |
| `tx` | Texas | Alternative 1 |
| `ca` | California | Alternative 2 |
| `ny` | New York | Alternative 3 |
| `fl` | Florida | Alternative 4 |

### BEM Structure

```
.{prefix}-{block}__{element}--{modifier}
```

**Block** - Standalone component:
```
.jb-hero
.jb-card
.jb-header
.jb-gallery
```

**Element** - Part of block:
```
.jb-hero__title
.jb-hero__subtitle
.jb-hero__cta
.jb-card__image
.jb-card__content
```

**Modifier** - Variation:
```
.jb-hero__title--large
.jb-card--featured
.jb-btn--primary
```

### Geographic Variants (Frames Style)

For multiple versions of same component:
```
.jb-hero-barcelona
.jb-hero-london
.jb-header-milan
.jb-gallery-tokyo
```

### Global Class JSON Format

```json
{
  "globalClasses": [
    {
      "id": "gc001",
      "name": "jb-hero__title",
      "settings": {
        "_typography": {
          "font-size": "var(--h1)",
          "font-weight": "900",
          "line-height": "1.1",
          "color": { "raw": "var(--base)" }
        }
      }
    }
  ]
}
```

### Required Global Classes Per Section

Every section output MUST include relevant global classes:

| Section Type | Required Classes |
|--------------|------------------|
| Hero | `__title`, `__subtitle`, `__cta` |
| Header | `__logo`, `__nav`, `__cta` |
| Card | `__image`, `__title`, `__text`, `__link` |
| Gallery | `__grid`, `__item`, `__caption` |
| Footer | `__logo`, `__nav`, `__social`, `__legal` |

---

## ACSS Variable Rules

### Always Use Variables

NEVER hardcode these values:

| Property | Use Variable |
|----------|--------------|
| Colors | `var(--primary)`, `var(--base)`, `var(--white)` |
| Spacing | `var(--space-m)`, `var(--section-space-l)` |
| Typography | `var(--h1)`, `var(--text-m)` |
| Border radius | `var(--radius)` |
| Gaps | `var(--grid-gap)`, `var(--space-s)` |

### Breakout Classes

For full-width sections, use ACSS breakout classes:

| Class | Width | CSS Mechanics |
|-------|-------|---------------|
| `breakout--s` | 60vw | `margin: 0 calc(-30vw + 50%)` |
| `breakout--m` | 70vw | `margin: 0 calc(-35vw + 50%)` |
| `breakout--l` | 80vw | `margin: 0 calc(-40vw + 50%)` |
| `breakout--xl` | 90vw | `margin: 0 calc(-45vw + 50%)` |
| `breakout--full` | 100vw | `margin-inline: calc(-50vw + 50%)` |

**Key Details:**
- Breakouts only apply at XL breakpoint and above (desktop)
- Below XL, partial breakouts (`s`, `m`, `l`, `xl`) collapse to 100%
- `breakout--full` stays full-width at ALL breakpoints
- Uses `!important` to override container constraints
- Requires element to be inside a centered container

**Usage:**
```json
{
  "settings": {
    "_cssGlobalClasses": ["breakout--full"]
  }
}
```

### Content-Grid System (Alternative)

For multi-zone layouts with flexible child placement:

```json
{
  "settings": {
    "_cssGlobalClasses": ["content-grid"]
  }
}
```

Child elements then use placement classes:

| Class | Description |
|-------|-------------|
| `content--full` | Full width without gutter |
| `content--full-safe` | Full width with gutter padding |
| `content--feature` | Wider than content (+50px each side) |
| `content--feature-max` | Even wider (+100px each side) |

**When to Use:**

| Scenario | Use |
|----------|-----|
| Full-viewport hero/header | `breakout--full` on section |
| Featured image breaking out | `breakout--l` or `breakout--xl` on element |
| Multi-zone section layout | `content-grid` on parent |
| Standard contained content | No breakout class needed |

---

## Image Placement Strategy

### Option 1: Image Element (Preferred for Content Images)

Use `<image>` element when:
- Image is content (not decorative)
- Needs alt text for accessibility
- Part of a gallery or grid
- Should be lazy-loaded

```json
{
  "id": "img001",
  "name": "image",
  "parent": "blk001",
  "children": [],
  "settings": {
    "image": {
      "url": "{image_url}",
      "alt": "Description of image"
    },
    "_width": "100%",
    "_height": "auto",
    "_objectFit": "cover"
  }
}
```

### Option 2: Div with Background (For Decorative/Layout)

Use div with background when:
- Image is purely decorative
- Need fixed aspect ratio container
- Overlay text on image
- Complex grid layouts with spanning cells

```json
{
  "id": "div001",
  "name": "div",
  "parent": "grd001",
  "children": [],
  "settings": {
    "_background": {
      "image": {
        "url": "{image_url}",
        "size": "cover",
        "position": "center center"
      }
    },
    "_aspectRatio": "16/9"
  }
}
```

### Option 3: Block with Background + Content

Use for hero sections with text overlay:

```json
{
  "id": "blk001",
  "name": "block",
  "parent": "sec001",
  "children": ["hdg001", "txt001"],
  "settings": {
    "_background": {
      "image": {
        "url": "{image_url}",
        "size": "cover",
        "position": "center center"
      }
    },
    "_minHeight": "500px",
    "_display": "flex",
    "_alignItems": "center",
    "_justifyContent": "center"
  }
}
```

---

## Element Hierarchy

### Standard Section Structure

```
section (parent: 0)
└── container (parent: section)
    └── block/div (parent: container)
        ├── heading (parent: block)
        ├── text (parent: block)
        └── button (parent: block)
```

### Full-Width Section Structure

```
section (parent: 0, class: breakout--full)
└── div (parent: section, width: 100%)
    ├── div (parent: wrapper, width: 60%)
    │   └── content...
    └── div (parent: wrapper, width: 40%)
        └── content...
```

---

## Responsive Breakpoints

| Bricks Suffix | Breakpoint | Description |
|---------------|------------|-------------|
| (default) | Desktop | Base styles |
| `:tablet_portrait` | 991px | Vertical tablet |
| `:mobile_landscape` | 767px | Horizontal phone |
| `:mobile_portrait` | 478px | Vertical phone |

**Usage:**
```json
{
  "settings": {
    "_width": "50%",
    "_width:tablet_portrait": "100%",
    "_direction": "row",
    "_direction:tablet_portrait": "column"
  }
}
```

---

## Custom CSS Patterns

### When to Use `_cssCustom`

| Use Settings | Use Custom CSS |
|--------------|----------------|
| Simple padding/margin | Pseudo-elements (`::before`, `::after`) |
| Background colors | CSS masks, complex gradients |
| Flex direction, gaps | Hover/focus states |
| Font sizes | Multi-column layouts |
| Border radius | CSS variable definitions |
| Z-index | Animations, transitions |

### Element ID Targeting

```json
{
  "_cssCustom": "#brxe-abc123 {\n  position: relative;\n}\n\n#brxe-abc123::before {\n  content: '';\n  position: absolute;\n  inset: 0;\n  background: var(--base-trans-50);\n}"
}
```

---

## Quality Checklist

Before outputting JSON, verify:

- [ ] All IDs are unique 6-character alphanumeric
- [ ] Parent-child relationships are correct
- [ ] All children arrays contain valid child IDs
- [ ] ACSS variables used for ALL colors, spacing, typography
- [ ] BEM-named global classes created and applied
- [ ] Responsive styles included for tablet/mobile
- [ ] `breakout--full` used for full-width sections
- [ ] Images use appropriate method (element vs background)
- [ ] JSON is valid and complete

---

## Default Configuration

```
sourceUrl: https://medsparanker.com
classPrefix: jb
bricksVersion: 2.1.4
```

---

## Color Palette (medsparanker.com)

| Variable | Hex | Usage |
|----------|-----|-------|
| `var(--primary)` | #E56C70 | Coral red - CTAs, accents |
| `var(--secondary)` | #42B9F1 | Bright blue - Links |
| `var(--accent)` | #18a4b9 | Teal - Secondary accents |
| `var(--base)` | #00040A | Near black - Text, dark bg |
| `var(--neutral)` | #D5D8DD | Light gray - Borders |
| `var(--white)` | #ffffff | White backgrounds |

---

## Related Files

- `~/.claude/agents/bricks-builder.md` - Main agent
- `~/.claude/knowledge/bricks/02-acss-variables.md` - ACSS reference
- `~/.claude/skills/learned/frames-custom-css-patterns.md` - CSS patterns
