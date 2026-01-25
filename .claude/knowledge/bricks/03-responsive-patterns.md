# Responsive Patterns for Bricks Builder

Complete guide to implementing responsive designs in Bricks Builder with ACSS.

## Breakpoint System

### Bricks Breakpoints

| Suffix | Approx Width | Description |
|--------|--------------|-------------|
| (none) | 1920px+ | Desktop (default) |
| `:tablet_portrait` | ~1024px | Vertical tablet |
| `:mobile_landscape` | ~768px | Horizontal phone |
| `:mobile_portrait` | ~480px | Vertical phone |

### ACSS Breakpoint Mapping

| ACSS | Bricks Equivalent |
|------|-------------------|
| XL (Desktop) | Default |
| L (Tablet) | `:tablet_portrait` |
| M (Phone Landscape) | `:mobile_landscape` |
| S (Phone Portrait) | `:mobile_portrait` |

## Responsive Settings Syntax

Add breakpoint suffix to any setting key:

```json
{
  "settings": {
    "_property": "desktop-value",
    "_property:tablet_portrait": "tablet-value",
    "_property:mobile_landscape": "landscape-value",
    "_property:mobile_portrait": "mobile-value"
  }
}
```

## Common Responsive Patterns

### Grid Columns

```json
{
  "_display": "grid",
  "_gridTemplateColumns": "repeat(4, 1fr)",
  "_gridTemplateColumns:tablet_portrait": "repeat(2, 1fr)",
  "_gridTemplateColumns:mobile_portrait": "repeat(1, 1fr)",
  "_gridGap": "var(--grid-gap)"
}
```

### Flex Direction

```json
{
  "_display": "flex",
  "_direction": "row",
  "_direction:tablet_portrait": "column",
  "_alignItems": "center",
  "_rowGap": "var(--space-m)"
}
```

### Section Padding

```json
{
  "_padding": {
    "top": "var(--section-space-xl)",
    "bottom": "var(--section-space-xl)"
  },
  "_padding:tablet_portrait": {
    "top": "var(--section-space-l)",
    "bottom": "var(--section-space-l)"
  },
  "_padding:mobile_portrait": {
    "top": "var(--section-space-m)",
    "bottom": "var(--section-space-m)"
  }
}
```

### Typography Scaling

```json
{
  "_typography": {
    "font-size": "var(--h1)",
    "text-align": "left"
  },
  "_typography:tablet_portrait": {
    "font-size": "var(--h2)"
  },
  "_typography:mobile_portrait": {
    "font-size": "var(--h3)",
    "text-align": "center"
  }
}
```

### Width Constraints

```json
{
  "_width": "50%",
  "_width:tablet_portrait": "75%",
  "_width:mobile_portrait": "100%",
  "_widthMax": "600px"
}
```

### Visibility

```json
{
  "_display": "block",
  "_display:mobile_portrait": "none"
}
```

Or use hide settings:

```json
{
  "_hideElementBuilder": false,
  "_hideElementFrontend": false,
  "_hideElementFrontend:mobile_portrait": true
}
```

### Gap Adjustments

```json
{
  "_rowGap": "var(--space-xl)",
  "_rowGap:tablet_portrait": "var(--space-l)",
  "_rowGap:mobile_portrait": "var(--space-m)",
  "_columnGap": "var(--grid-gap)",
  "_columnGap:mobile_portrait": "var(--space-s)"
}
```

## Responsive Layout Patterns

### Two-Column to Stacked

Desktop: Side by side
Mobile: Stacked vertically

```json
{
  "id": "con001",
  "name": "container",
  "settings": {
    "_display": "grid",
    "_gridTemplateColumns": "1fr 1fr",
    "_gridTemplateColumns:tablet_portrait": "1fr",
    "_gridGap": "var(--space-xl)",
    "_alignItems": "center"
  }
}
```

### Three-Column Card Grid

Desktop: 3 columns
Tablet: 2 columns
Mobile: 1 column

```json
{
  "id": "grd001",
  "name": "block",
  "settings": {
    "_display": "grid",
    "_gridTemplateColumns": "repeat(3, 1fr)",
    "_gridTemplateColumns:tablet_portrait": "repeat(2, 1fr)",
    "_gridTemplateColumns:mobile_portrait": "repeat(1, 1fr)",
    "_gridGap": "var(--grid-gap)"
  }
}
```

### Hero with Image

Desktop: Text left, image right (50/50)
Tablet: Text on top, image below (stacked)
Mobile: Smaller text, full-width image

```json
{
  "id": "hero01",
  "name": "container",
  "settings": {
    "_display": "grid",
    "_gridTemplateColumns": "1fr 1fr",
    "_gridTemplateColumns:tablet_portrait": "1fr",
    "_gridGap": "var(--space-xl)",
    "_gridGap:mobile_portrait": "var(--space-l)",
    "_alignItems": "center"
  }
}
```

### Navigation Header

Desktop: Logo - Menu - CTA in row
Mobile: Logo - Hamburger

```json
{
  "id": "nav001",
  "name": "container",
  "settings": {
    "_display": "flex",
    "_justifyContent": "space-between",
    "_alignItems": "center"
  }
}
```

Menu element (hide on mobile, show hamburger):

```json
{
  "id": "menu01",
  "name": "nav-nestable",
  "settings": {
    "_display": "flex",
    "_display:mobile_portrait": "none"
  }
}
```

### Footer Columns

Desktop: 4 columns
Tablet: 2 columns
Mobile: 1 column (stacked)

```json
{
  "id": "ftr001",
  "name": "container",
  "settings": {
    "_display": "grid",
    "_gridTemplateColumns": "repeat(4, 1fr)",
    "_gridTemplateColumns:tablet_portrait": "repeat(2, 1fr)",
    "_gridTemplateColumns:mobile_portrait": "1fr",
    "_gridGap": "var(--space-l)",
    "_gridGap:mobile_portrait": "var(--space-xl)"
  }
}
```

## Responsive Global Classes

Define responsive styles in globalClasses:

```json
{
  "globalClasses": [
    {
      "id": "cls001",
      "name": "jb-hero__title",
      "settings": {
        "_typography": {
          "font-size": "var(--h1)",
          "line-height": "1.1"
        },
        "_typography:tablet_portrait": {
          "font-size": "var(--h2)"
        },
        "_typography:mobile_portrait": {
          "font-size": "var(--h3)",
          "text-align": "center"
        }
      }
    },
    {
      "id": "cls002",
      "name": "jb-card",
      "settings": {
        "_padding": {
          "top": "var(--space-l)",
          "right": "var(--space-l)",
          "bottom": "var(--space-l)",
          "left": "var(--space-l)"
        },
        "_padding:mobile_portrait": {
          "top": "var(--space-m)",
          "right": "var(--space-m)",
          "bottom": "var(--space-m)",
          "left": "var(--space-m)"
        }
      }
    }
  ]
}
```

## Responsive Custom CSS

For complex responsive behavior, use `_cssCustom`:

```json
{
  "_cssCustom": "#brxe-abc123 {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n}\n\n@media (max-width: 1024px) {\n  #brxe-abc123 {\n    grid-template-columns: 1fr;\n  }\n}\n\n@media (max-width: 480px) {\n  #brxe-abc123 {\n    padding: var(--space-s);\n  }\n}"
}
```

## Order Changes

Change element order on different breakpoints:

```json
{
  "id": "txt001",
  "name": "block",
  "settings": {
    "_order": "1",
    "_order:tablet_portrait": "2"
  }
}
```

## Responsive Images

```json
{
  "id": "img001",
  "name": "image",
  "settings": {
    "image": { "url": "...", "size": "large" },
    "_width": "100%",
    "_height": "auto",
    "_objectFit": "cover",
    "_heightMax": "600px",
    "_heightMax:tablet_portrait": "400px",
    "_heightMax:mobile_portrait": "300px"
  }
}
```

## Best Practices

1. **Mobile-first thinking** - Consider mobile layout, then expand
2. **Use ACSS spacing scale** - Reduces at smaller breakpoints naturally
3. **Test all breakpoints** - Verify tablet and mobile specifically
4. **Simplify on mobile** - Hide non-essential elements
5. **Touch-friendly** - Larger tap targets on mobile (min 44px)
6. **Readable text** - Don't go below `var(--text-s)` on mobile
7. **Stack layouts** - Grid/flex to single column on mobile
8. **Reduce gaps** - Smaller spacing on smaller screens
9. **Center on mobile** - Text alignment often works better centered

## Complete Responsive Section Example

```json
{
  "content": [
    {
      "id": "sec001",
      "name": "section",
      "parent": 0,
      "children": ["con001"],
      "settings": {
        "_padding": {
          "top": "var(--section-space-xl)",
          "bottom": "var(--section-space-xl)"
        },
        "_padding:tablet_portrait": {
          "top": "var(--section-space-l)",
          "bottom": "var(--section-space-l)"
        },
        "_padding:mobile_portrait": {
          "top": "var(--section-space-m)",
          "bottom": "var(--section-space-m)"
        }
      },
      "label": "Features"
    },
    {
      "id": "con001",
      "name": "container",
      "parent": "sec001",
      "children": ["hdg001", "grd001"],
      "settings": {
        "_widthMax": "1360",
        "_rowGap": "var(--space-xl)",
        "_rowGap:mobile_portrait": "var(--space-l)"
      }
    },
    {
      "id": "hdg001",
      "name": "heading",
      "parent": "con001",
      "children": [],
      "settings": {
        "text": "Our Features",
        "tag": "h2",
        "_typography": {
          "text-align": "center"
        }
      }
    },
    {
      "id": "grd001",
      "name": "block",
      "parent": "con001",
      "children": ["crd001", "crd002", "crd003"],
      "settings": {
        "_display": "grid",
        "_gridTemplateColumns": "repeat(3, 1fr)",
        "_gridTemplateColumns:tablet_portrait": "repeat(2, 1fr)",
        "_gridTemplateColumns:mobile_portrait": "1fr",
        "_gridGap": "var(--grid-gap)"
      }
    },
    {
      "id": "crd001",
      "name": "div",
      "parent": "grd001",
      "children": [],
      "settings": {
        "_cssGlobalClasses": ["cls001"]
      }
    },
    {
      "id": "crd002",
      "name": "div",
      "parent": "grd001",
      "children": [],
      "settings": {
        "_cssGlobalClasses": ["cls001"]
      }
    },
    {
      "id": "crd003",
      "name": "div",
      "parent": "grd001",
      "children": [],
      "settings": {
        "_cssGlobalClasses": ["cls001"]
      }
    }
  ],
  "globalClasses": [
    {
      "id": "cls001",
      "name": "jb-feature-card",
      "settings": {
        "_background": { "color": { "raw": "var(--white)" } },
        "_padding": {
          "top": "var(--space-l)",
          "right": "var(--space-l)",
          "bottom": "var(--space-l)",
          "left": "var(--space-l)"
        },
        "_padding:mobile_portrait": {
          "top": "var(--space-m)",
          "right": "var(--space-m)",
          "bottom": "var(--space-m)",
          "left": "var(--space-m)"
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
          "spread": "0",
          "color": { "raw": "var(--base-trans-10)" }
        }
      }
    }
  ]
}
```
