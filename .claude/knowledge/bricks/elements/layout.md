# Layout Elements

Core structural elements for building page layouts.

## Section

The root-level element for page sections. Always `parent: 0`.

```json
{
  "id": "sec001",
  "name": "section",
  "parent": 0,
  "children": ["con001"],
  "settings": {
    "_padding": {
      "top": "var(--section-space-l)",
      "right": "0",
      "bottom": "var(--section-space-l)",
      "left": "0"
    },
    "_background": {
      "color": { "raw": "var(--base)" }
    }
  },
  "label": "Hero Section"
}
```

### Common Section Settings

| Setting | Description | Example |
|---------|-------------|---------|
| `_padding` | Vertical spacing | `var(--section-space-l)` |
| `_background` | Background color/image | `var(--base)` |
| `_gradient` | Overlay gradient | See gradient docs |
| `_minHeight` | Minimum height | `100vh`, `600px` |

### Section with Background Image + Overlay

```json
{
  "settings": {
    "_background": {
      "image": {
        "url": "https://example.com/hero-bg.jpg",
        "size": "cover",
        "position": "center center"
      }
    },
    "_gradient": {
      "angle": "180",
      "colors": [
        { "id": "g1", "color": { "raw": "var(--base-trans-70)" }, "stop": "0" },
        { "id": "g2", "color": { "raw": "var(--base-trans-30)" }, "stop": "100" }
      ]
    }
  }
}
```

---

## Container

Width-constrained wrapper element. Centers content with max-width.

```json
{
  "id": "con001",
  "name": "container",
  "parent": "sec001",
  "children": ["hdg001", "txt001"],
  "settings": {
    "_widthMax": "1360",
    "_padding": {
      "right": "var(--space-m)",
      "left": "var(--space-m)"
    },
    "_display": "flex",
    "_direction": "column",
    "_alignItems": "center",
    "_rowGap": "var(--space-m)"
  }
}
```

### Common Container Settings

| Setting | Description | Example |
|---------|-------------|---------|
| `_widthMax` | Maximum width | `1360`, `1100`, `800` |
| `_padding` | Horizontal padding | `var(--space-m)` |
| `_display` | Display type | `flex`, `grid` |
| `_direction` | Flex direction | `row`, `column` |
| `_justifyContent` | Horizontal alignment | `center`, `space-between` |
| `_alignItems` | Vertical alignment | `center`, `flex-start` |
| `_rowGap` | Vertical gap | `var(--space-m)` |
| `_columnGap` | Horizontal gap | `var(--space-l)` |

### Container for Two-Column Layout

```json
{
  "settings": {
    "_widthMax": "1360",
    "_display": "grid",
    "_gridTemplateColumns": "1fr 1fr",
    "_gridTemplateColumns:tablet_portrait": "1fr",
    "_gridGap": "var(--space-xl)",
    "_alignItems": "center"
  }
}
```

---

## Block

Flexbox container with 100% width. Great for layout groups.

```json
{
  "id": "blk001",
  "name": "block",
  "parent": "con001",
  "children": ["hdg001", "txt001", "btn001"],
  "settings": {
    "_display": "flex",
    "_direction": "column",
    "_rowGap": "var(--space-m)",
    "_alignItems": "flex-start"
  },
  "label": "Content Block"
}
```

### Block for Card Grid

```json
{
  "settings": {
    "_display": "grid",
    "_gridTemplateColumns": "repeat(3, 1fr)",
    "_gridTemplateColumns:tablet_portrait": "repeat(2, 1fr)",
    "_gridTemplateColumns:mobile_portrait": "1fr",
    "_gridGap": "var(--grid-gap)"
  }
}
```

### Block with Loop (Repeating Content)

```json
{
  "settings": {
    "hasLoop": true,
    "query": {
      "post_type": ["post"],
      "posts_per_page": "6",
      "orderby": ["date"],
      "order": ["desc"]
    }
  }
}
```

---

## Div

Plain, unstyled container. Use for wrappers and grouping.

```json
{
  "id": "div001",
  "name": "div",
  "parent": "blk001",
  "children": ["ico001", "txt001"],
  "settings": {
    "_display": "flex",
    "_direction": "row",
    "_alignItems": "center",
    "_columnGap": "var(--space-s)"
  },
  "label": "Icon + Text"
}
```

### Div as Card Container

```json
{
  "settings": {
    "_background": { "color": { "raw": "var(--white)" } },
    "_padding": {
      "top": "var(--space-l)",
      "right": "var(--space-l)",
      "bottom": "var(--space-l)",
      "left": "var(--space-l)"
    },
    "_border": {
      "radius": {
        "top": "var(--radius)",
        "right": "var(--radius)",
        "bottom": "var(--radius)",
        "left": "var(--radius)"
      }
    },
    "_boxShadow": {
      "offsetX": "0",
      "offsetY": "4px",
      "blur": "20px",
      "color": { "raw": "var(--base-trans-10)" }
    }
  }
}
```

### Div as Overlay

```json
{
  "settings": {
    "_position": "absolute",
    "_top": "0",
    "_right": "0",
    "_bottom": "0",
    "_left": "0",
    "_background": { "color": { "raw": "var(--base-trans-50)" } },
    "_zIndex": "1"
  },
  "label": "Overlay"
}
```

### Div for Aspect Ratio Container

```json
{
  "settings": {
    "_position": "relative",
    "_cssCustom": "#brxe-div001 {\n  aspect-ratio: 16/9;\n  overflow: hidden;\n}"
  }
}
```

---

## Layout Hierarchy Best Practices

### Standard Page Section

```
section (parent: 0)
└── container
    ├── heading (section title)
    └── block (content wrapper)
        └── children...
```

### Two-Column Layout

```
section (parent: 0)
└── container (grid: 1fr 1fr)
    ├── block (left column)
    │   ├── heading
    │   ├── text
    │   └── button
    └── block (right column)
        └── image
```

### Card Grid

```
section (parent: 0)
└── container
    ├── heading (section title)
    └── block (grid: repeat(3, 1fr))
        ├── div (card 1)
        ├── div (card 2)
        └── div (card 3)
```

### Header Navigation

```
section (parent: 0, sticky)
└── container (flex: space-between)
    ├── image (logo)
    ├── nav-nestable (menu)
    └── button (CTA)
```

---

## Position Settings

### Sticky Header

```json
{
  "settings": {
    "_position": "sticky",
    "_top": "0",
    "_zIndex": "100"
  }
}
```

### Absolute Positioning

```json
{
  "settings": {
    "_position": "absolute",
    "_top": "50%",
    "_left": "50%",
    "_cssCustom": "#brxe-id {\n  transform: translate(-50%, -50%);\n}"
  }
}
```

### Fixed Background

```json
{
  "settings": {
    "_background": {
      "image": {
        "url": "...",
        "attachment": "fixed"
      }
    }
  }
}
```
