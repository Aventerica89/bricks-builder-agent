# Bricks Nested Grid Pattern for Asymmetric Layouts

**Extracted:** 2026-01-25
**Context:** Building photo grids or card layouts where columns have different row ratios

## Problem

When creating asymmetric grid layouts (e.g., a 2x2 photo grid where left column has large-top/small-bottom and right column has small-top/large-bottom), a flat grid structure doesn't provide the control needed. Each column needs its own grid with different row ratios.

## Solution

Use **nested column wrappers** with separate CSS Grid definitions for each column.

### Structure

```
Section (relative, min-height, row direction, stretch)
├── Background Divs (absolute, hidden in builder/frontend)
├── Container (absolute overlay with inset 0)
│   └── Content Grid (2 columns)
│       ├── Photo Grid Wrapper
│       │   ├── Left Column Wrapper (grid: 1fr 0.4fr rows)
│       │   │   ├── Image (large)
│       │   │   └── Image (small)
│       │   └── Right Column Wrapper (grid: 0.4fr 1fr rows)
│       │       ├── Image (small)
│       │       └── Image (large)
│       └── Content Block
```

### Key Settings

**Section:**
```json
{
  "_position": "relative",
  "_heightMin": "60rem",
  "_direction": "row",
  "_alignItems": "stretch"
}
```

**Background Divs (for split backgrounds):**
```json
{
  "_position": "absolute",
  "_top": "0",
  "_left": "0",
  "_bottom": "0",
  "_width": "60%",
  "_hideElementBuilder": true,
  "_hideElementFrontend": true
}
```

**Container (absolute overlay):**
```json
{
  "_position": "absolute",
  "_top": "0",
  "_right": "0",
  "_bottom": "0",
  "_left": "0",
  "_cssCustom": "#brxe-{id} {\n  grid-column: full;\n  z-index: 2;\n}"
}
```

**Left Column Wrapper (large top, small bottom):**
```json
{
  "name": "test-block",
  "settings": {
    "_cssCustom": ".test-block {\n  display: grid;\n\tgrid-template-columns: var(--grid-1);\n\tgrid-template-rows: 1fr 0.4fr;\n}"
  }
}
```

**Right Column Wrapper (small top, large bottom):**
```json
{
  "name": "test-block--r",
  "settings": {
    "_cssCustom": ".test-block--r {\n  display: grid;\n\tgrid-template-columns: var(--grid-1);\n\tgrid-template-rows: 0.4fr 1fr;\n}"
  }
}
```

**Photo Grid Parent (CSS custom variables):**
```json
{
  "name": "test-photo-grid",
  "settings": {
    "_cssCustom": ".test-photo-grid {\n  --max-height: 800px;\n  --photo-gap: 1rem;\n}",
    "_gridGap": "var(--photo-gap)"
  }
}
```

**Images:**
```json
{
  "name": "image",
  "settings": {
    "image": {"useDynamicData": false},
    "_objectFit": "cover",
    "_width": "100%",
    "_height": "100%",
    "themeStyles": {"caption": "none"}
  }
}
```

## Example

For a 4-photo asymmetric grid:

| Left Column | Right Column |
|-------------|--------------|
| Large (1fr) | Small (0.4fr)|
| Small (0.4fr)| Large (1fr) |

Create two wrapper divs with inverted grid-template-rows:
- Left: `grid-template-rows: 1fr 0.4fr`
- Right: `grid-template-rows: 0.4fr 1fr`

## When to Use

- Photo galleries with asymmetric sizing
- Card layouts where items need different proportions per column
- Any layout requiring different row ratios in adjacent columns
- Split background sections with overlapping content

## Key Learnings

1. **Use `_heightMin` not `_minHeight`** - Bricks uses this property name
2. **Section direction: row + alignItems: stretch** - Makes children fill height
3. **Hide background divs** - Use `_hideElementBuilder` and `_hideElementFrontend` for structural-only elements
4. **Container as absolute overlay** - Position with inset 0 and z-index for layering
5. **CSS custom variables in global classes** - Define component variables in `_cssCustom`
6. **Image themeStyles** - Use `{"caption": "none"}` to disable captions
7. **Nested grids for asymmetry** - Don't try to achieve complex ratios with a flat grid
