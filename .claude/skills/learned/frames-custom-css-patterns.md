# Frames Custom CSS Patterns for Bricks Builder

**Extracted:** 2026-01-25
**Context:** How Frames templates use the custom CSS area (`_cssCustom`) in Bricks Builder elements

## Problem

When generating Bricks JSON, need to understand:
1. When to use inline settings vs custom CSS
2. How to properly reference element IDs in custom CSS
3. How to define CSS variables for theming
4. How to structure complex layouts (overlays, grids, masks)

## Solution: Frames Custom CSS Patterns

### 1. Element-Scoped Custom CSS

Frames writes custom CSS that targets the element's own ID using `#brxe-{id}`:

```json
{
  "_cssCustom": "#brxe-abc123 {\n  position: relative;\n  overflow: clip;\n}\n\n#brxe-abc123::before {\n  content: '';\n  position: absolute;\n  inset: 0;\n  background: var(--overlay-color);\n}"
}
```

**Key Pattern:** Use `#brxe-{element-id}` to target the specific element.

### 2. CSS Variable Definitions at Component Root

Define theming variables on the parent element:

```json
{
  "id": "hdr001",
  "name": "section",
  "settings": {
    "_cssCustom": ".fr-header-london {\n  --header-border: .5em;\n  --header-bg: var(--neutral-ultra-dark);\n  --nav-link-color: var(--text-light-muted);\n  --nav-link-hover-color: var(--white);\n  --dd-bg-color: var(--white);\n  --dd-border-radius: var(--radius);\n  --dd-box-shadow: 0 10px 30px var(--shadow-color);\n}"
  }
}
```

### 3. Pseudo-Element Overlays (Background Alpha Pattern)

For overlay effects, use `::before` or `::after`:

```json
{
  "_cssCustom": ".fr-background-alpha__overlay {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1;\n  background: linear-gradient(180deg, var(--overlay-start) 0%, var(--overlay-end) 100%);\n}"
}
```

### 4. Mask Effects for Fade Edges

Hero sections often use CSS masks for fading edges:

```json
{
  "_cssCustom": "#brxe-img001 {\n  mask-image: radial-gradient(ellipse at center, black 50%, transparent 100%);\n}\n\n#brxe-img002 {\n  mask-image: linear-gradient(to bottom, black 0%, transparent 100%);\n}"
}
```

### 5. Grid Layouts with CSS Variables

For responsive grids, define column count as variable:

```json
{
  "_cssCustom": ".hero-cali__bg {\n  --col-count: 5;\n  columns: var(--col-count);\n  column-gap: var(--space-s);\n}\n\n@media (max-width: 992px) {\n  .hero-cali__bg {\n    --col-count: 4;\n  }\n}\n\n@media (max-width: 767px) {\n  .hero-cali__bg {\n    --col-count: 3;\n  }\n}"
}
```

### 6. Hover/State Effects

Add transitions and hover states in custom CSS:

```json
{
  "_cssCustom": ".jb-card {\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.jb-card:hover {\n  transform: translateY(-5px);\n  box-shadow: 0 12px 40px var(--base-trans-15);\n}"
}
```

### 7. Accent Bars/Decorative Elements

For decorative accent bars (like the red bar in gallery headers):

```json
{
  "_cssCustom": ".jb-content::before {\n  content: '';\n  position: absolute;\n  left: 0;\n  top: var(--space-xl);\n  bottom: var(--space-xl);\n  width: 6px;\n  background: var(--primary);\n}"
}
```

## When to Use Custom CSS vs Settings

### Use Settings (`_padding`, `_background`, etc.) for:
- Simple single-value properties
- Responsive breakpoint variations (`:tablet_portrait`)
- Standard layout (flex direction, gaps)

### Use Custom CSS (`_cssCustom`) for:
- Pseudo-elements (`::before`, `::after`)
- CSS masks and complex gradients
- Hover/focus/active states
- Multi-column layouts
- CSS variable definitions
- Complex selectors (child combinators, nth-child)
- Animations and transitions

## Complete Example: Background with Overlay

```json
{
  "id": "bgalpha",
  "name": "div",
  "parent": "sec001",
  "children": [],
  "settings": {
    "_position": "absolute",
    "_top": "0",
    "_right": "0",
    "_bottom": "0",
    "_left": "0",
    "_zIndex": "-1",
    "_cssGlobalClasses": ["fr-background-alpha"],
    "_cssCustom": ".fr-background-alpha {\n  --overlay-color: var(--base-trans-70);\n}\n\n.fr-background-alpha__image {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  z-index: -2;\n}\n\n.fr-background-alpha__overlay {\n  position: absolute;\n  inset: 0;\n  background: var(--overlay-color);\n  z-index: -1;\n}"
  },
  "label": "Background Alpha"
}
```

## Class Prefix Reference

| Prefix | Source |
|--------|--------|
| `fr-` | Frames components |
| `brxe-` | Bricks element IDs |
| `brx-` | Bricks state classes (`.brx-open`) |
| `jb-` | Custom prefix (our convention) |

## Sources

- [Frames Background Alpha](https://bricks.getframes.io/template/background-alpha/)
- [Frames Hero Cali](https://bricks.getframes.io/template/hero-cali/)
- [Frames Header London](https://bricks.getframes.io/template/header-london/)
- [Frames Header Basel](https://bricks.getframes.io/template/header-basel/)
