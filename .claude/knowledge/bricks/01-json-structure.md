# Bricks Builder JSON Structure

Complete reference for the Bricks Builder copy-paste JSON format.

## Top-Level Structure

```json
{
  "content": [],
  "source": "bricksCopiedElements",
  "sourceUrl": "https://medsparanker.com",
  "version": "2.1.4",
  "globalClasses": []
}
```

| Property | Type | Description |
|----------|------|-------------|
| `content` | array | All elements in hierarchical order |
| `source` | string | Always `"bricksCopiedElements"` for copy-paste |
| `sourceUrl` | string | Origin website URL |
| `version` | string | Bricks Builder version |
| `globalClasses` | array | Reusable style classes |

## Element Object Structure

```json
{
  "id": "abc123",
  "name": "section",
  "parent": 0,
  "children": ["def456", "ghi789"],
  "settings": {},
  "label": "Hero Section",
  "themeStyles": {}
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique 6-char alphanumeric ID |
| `name` | string | Yes | Element type (e.g., "section", "heading") |
| `parent` | string/number | Yes | Parent element ID, or `0` for root |
| `children` | array | Yes | Array of child element IDs |
| `settings` | object | Yes | Element configuration and styles |
| `label` | string | No | Custom display name in structure panel |
| `themeStyles` | object | No | Theme style overrides |

## Parent-Child Relationships

### Root Elements
Root elements have `parent: 0` (number, not string):

```json
{
  "id": "sec001",
  "name": "section",
  "parent": 0,
  "children": ["con001"]
}
```

### Nested Elements
Child elements reference parent ID as a string:

```json
{
  "id": "con001",
  "name": "container",
  "parent": "sec001",
  "children": ["hdg001", "txt001"]
}
```

### Children Array
Parent elements list all direct children IDs:

```json
{
  "id": "sec001",
  "children": ["con001", "con002", "con003"]
}
```

## Settings Object

### Universal Settings (Underscore Prefix)

All elements support these style settings:

```json
{
  "settings": {
    "_margin": {},
    "_padding": {},
    "_background": {},
    "_border": {},
    "_typography": {},
    "_boxShadow": {},
    "_display": "",
    "_direction": "",
    "_justifyContent": "",
    "_alignItems": "",
    "_flexWrap": "",
    "_rowGap": "",
    "_columnGap": "",
    "_width": "",
    "_height": "",
    "_widthMax": "",
    "_heightMax": "",
    "_widthMin": "",
    "_heightMin": "",
    "_position": "",
    "_zIndex": "",
    "_top": "",
    "_right": "",
    "_bottom": "",
    "_left": "",
    "_overflow": "",
    "_opacity": "",
    "_cssGlobalClasses": [],
    "_cssCustom": ""
  }
}
```

### Element-Specific Settings

Non-underscore properties are element-specific:

**Heading:**
```json
{
  "text": "Your Heading",
  "tag": "h1"
}
```

**Text/Rich Text:**
```json
{
  "text": "<p>Your paragraph text</p>"
}
```

**Image:**
```json
{
  "image": {
    "id": 123,
    "url": "https://example.com/image.jpg",
    "filename": "image.jpg",
    "size": "large"
  }
}
```

**Button:**
```json
{
  "text": "Click Here",
  "link": {
    "type": "external",
    "url": "https://example.com"
  },
  "size": "md",
  "style": "primary"
}
```

**Icon:**
```json
{
  "icon": {
    "library": "fontawesome",
    "icon": "fas fa-star"
  },
  "iconSize": "24",
  "iconColor": { "raw": "var(--primary)" }
}
```

## Dimension Settings

### Padding/Margin

```json
{
  "_padding": {
    "top": "var(--space-l)",
    "right": "var(--space-m)",
    "bottom": "var(--space-l)",
    "left": "var(--space-m)"
  }
}
```

### Border

```json
{
  "_border": {
    "width": {
      "top": "1px",
      "right": "1px",
      "bottom": "1px",
      "left": "1px"
    },
    "style": "solid",
    "color": { "raw": "var(--neutral)" },
    "radius": {
      "top": "var(--radius)",
      "right": "var(--radius)",
      "bottom": "var(--radius)",
      "left": "var(--radius)"
    }
  }
}
```

## Background Settings

### Solid Color

```json
{
  "_background": {
    "color": { "raw": "var(--primary)" }
  }
}
```

### Image Background

```json
{
  "_background": {
    "image": {
      "url": "https://example.com/bg.jpg",
      "size": "cover",
      "position": "center center",
      "repeat": "no-repeat",
      "attachment": "fixed"
    }
  }
}
```

### Gradient

```json
{
  "_gradient": {
    "angle": "180",
    "colors": [
      {
        "id": "clr001",
        "color": { "raw": "var(--base-trans-80)" },
        "stop": "0"
      },
      {
        "id": "clr002",
        "color": { "raw": "transparent" },
        "stop": "100"
      }
    ]
  }
}
```

### Combined Background + Gradient (Overlay)

```json
{
  "_background": {
    "image": { "url": "https://example.com/bg.jpg", "size": "cover" }
  },
  "_gradient": {
    "angle": "180",
    "colors": [
      { "id": "g1", "color": { "raw": "var(--base-trans-70)" }, "stop": "0" },
      { "id": "g2", "color": { "raw": "var(--base-trans-30)" }, "stop": "100" }
    ]
  }
}
```

## Typography Settings

```json
{
  "_typography": {
    "font-family": "var(--heading-font-family)",
    "font-size": "var(--h1)",
    "font-weight": "700",
    "font-style": "normal",
    "line-height": "1.2",
    "letter-spacing": "0",
    "text-align": "center",
    "text-transform": "uppercase",
    "text-decoration": "none",
    "color": { "raw": "var(--base)" }
  }
}
```

## Box Shadow Settings

```json
{
  "_boxShadow": {
    "offsetX": "0",
    "offsetY": "4px",
    "blur": "20px",
    "spread": "0",
    "color": { "raw": "var(--base-trans-20)" },
    "inset": false
  }
}
```

## Global Classes

### Referencing Global Classes

```json
{
  "settings": {
    "_cssGlobalClasses": ["cls001", "cls002"]
  }
}
```

### Defining Global Classes

```json
{
  "globalClasses": [
    {
      "id": "cls001",
      "name": "jb-hero__title",
      "settings": {
        "_typography": {
          "font-size": "var(--h1)",
          "font-weight": "700",
          "color": { "raw": "var(--white)" }
        }
      }
    }
  ]
}
```

## Responsive Settings

Add breakpoint suffix to any setting key:

```json
{
  "_padding": { "top": "var(--section-space-l)" },
  "_padding:tablet_portrait": { "top": "var(--section-space-m)" },
  "_padding:mobile_portrait": { "top": "var(--section-space-s)" },
  
  "_gridTemplateColumns": "repeat(4, 1fr)",
  "_gridTemplateColumns:tablet_portrait": "repeat(2, 1fr)",
  "_gridTemplateColumns:mobile_portrait": "repeat(1, 1fr)",
  
  "_display": "flex",
  "_display:mobile_portrait": "block"
}
```

## Dynamic Data

### Post Fields

```json
{
  "text": "{post_title}",
  "image": { "useDynamicData": "{featured_image}" }
}
```

### ACF Fields

```json
{
  "text": "{acf_field_name}",
  "image": { "useDynamicData": "{acf_image_field}" }
}
```

### Loop/Query

```json
{
  "hasLoop": true,
  "query": {
    "post_type": ["post"],
    "posts_per_page": "6",
    "orderby": ["date"],
    "order": ["desc"]
  }
}
```

## Custom CSS

Inline custom CSS for the element:

```json
{
  "_cssCustom": "#brxe-abc123 {\n  position: relative;\n}\n\n#brxe-abc123:hover {\n  transform: translateY(-5px);\n}"
}
```

## Visibility Settings

```json
{
  "_hideElementBuilder": true,
  "_hideElementFrontend": false
}
```

## Complete Example

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
          "top": "var(--section-space-l)",
          "bottom": "var(--section-space-l)"
        },
        "_background": {
          "color": { "raw": "var(--base)" }
        }
      },
      "label": "Hero"
    },
    {
      "id": "con001",
      "name": "container",
      "parent": "sec001",
      "children": ["hdg001", "txt001", "btn001"],
      "settings": {
        "_widthMax": "1360",
        "_justifyContent": "center",
        "_alignItems": "center",
        "_direction": "column",
        "_rowGap": "var(--space-m)"
      }
    },
    {
      "id": "hdg001",
      "name": "heading",
      "parent": "con001",
      "children": [],
      "settings": {
        "text": "Welcome to Our Site",
        "tag": "h1",
        "_cssGlobalClasses": ["cls001"]
      }
    },
    {
      "id": "txt001",
      "name": "text-basic",
      "parent": "con001",
      "children": [],
      "settings": {
        "text": "Discover amazing things",
        "_cssGlobalClasses": ["cls002"]
      }
    },
    {
      "id": "btn001",
      "name": "button",
      "parent": "con001",
      "children": [],
      "settings": {
        "text": "Get Started",
        "link": { "type": "external", "url": "#" },
        "_cssGlobalClasses": ["cls003"]
      }
    }
  ],
  "source": "bricksCopiedElements",
  "sourceUrl": "https://medsparanker.com",
  "version": "2.1.4",
  "globalClasses": [
    {
      "id": "cls001",
      "name": "jb-hero__title",
      "settings": {
        "_typography": {
          "font-size": "var(--h1)",
          "font-weight": "700",
          "color": { "raw": "var(--white)" },
          "text-align": "center"
        }
      }
    },
    {
      "id": "cls002",
      "name": "jb-hero__subtitle",
      "settings": {
        "_typography": {
          "font-size": "var(--text-l)",
          "color": { "raw": "var(--neutral)" },
          "text-align": "center"
        }
      }
    },
    {
      "id": "cls003",
      "name": "jb-hero__cta",
      "settings": {
        "_background": { "color": { "raw": "var(--primary)" } },
        "_typography": { "color": { "raw": "var(--white)" } },
        "_padding": {
          "top": "var(--space-s)",
          "right": "var(--space-l)",
          "bottom": "var(--space-s)",
          "left": "var(--space-l)"
        },
        "_border": {
          "radius": { "top": "var(--radius)", "right": "var(--radius)", "bottom": "var(--radius)", "left": "var(--radius)" }
        }
      }
    }
  ]
}
```
