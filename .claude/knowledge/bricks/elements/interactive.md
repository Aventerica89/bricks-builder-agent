# Interactive Elements

Buttons, links, forms, and other interactive components.

## Button

Clickable button element.

```json
{
  "id": "btn001",
  "name": "button",
  "parent": "con001",
  "children": [],
  "settings": {
    "text": "Get Started",
    "link": {
      "type": "external",
      "url": "/contact"
    },
    "size": "md",
    "_background": { "color": { "raw": "var(--primary)" } },
    "_typography": {
      "color": { "raw": "var(--white)" },
      "font-weight": "600"
    },
    "_padding": {
      "top": "var(--space-s)",
      "right": "var(--space-l)",
      "bottom": "var(--space-s)",
      "left": "var(--space-l)"
    },
    "_border": {
      "radius": {
        "top": "var(--radius)",
        "right": "var(--radius)",
        "bottom": "var(--radius)",
        "left": "var(--radius)"
      }
    }
  }
}
```

### Button Sizes

| Size | Typical Padding |
|------|-----------------|
| `sm` | `var(--space-xs)` / `var(--space-m)` |
| `md` | `var(--space-s)` / `var(--space-l)` |
| `lg` | `var(--space-m)` / `var(--space-xl)` |

### Link Types

```json
// External URL
{ "link": { "type": "external", "url": "https://example.com" } }

// Internal page
{ "link": { "type": "internal", "url": "/about" } }

// Anchor
{ "link": { "type": "external", "url": "#contact" } }

// Email
{ "link": { "type": "external", "url": "mailto:info@example.com" } }

// Phone
{ "link": { "type": "external", "url": "tel:+1234567890" } }
```

### Primary Button (Filled)

```json
{
  "settings": {
    "text": "Primary Action",
    "_background": { "color": { "raw": "var(--primary)" } },
    "_typography": { "color": { "raw": "var(--white)" } },
    "_cssCustom": "#brxe-btn001:hover {\n  background-color: var(--primary-dark);\n}"
  }
}
```

### Secondary Button (Outline)

```json
{
  "settings": {
    "text": "Secondary Action",
    "_background": { "color": { "raw": "transparent" } },
    "_typography": { "color": { "raw": "var(--primary)" } },
    "_border": {
      "width": { "top": "2px", "right": "2px", "bottom": "2px", "left": "2px" },
      "style": "solid",
      "color": { "raw": "var(--primary)" },
      "radius": { "top": "var(--radius)", "right": "var(--radius)", "bottom": "var(--radius)", "left": "var(--radius)" }
    },
    "_cssCustom": "#brxe-btn001:hover {\n  background-color: var(--primary);\n  color: var(--white);\n}"
  }
}
```

### Ghost Button (Text Only)

```json
{
  "settings": {
    "text": "Learn More →",
    "_background": { "color": { "raw": "transparent" } },
    "_typography": { "color": { "raw": "var(--primary)" } },
    "_padding": { "top": "0", "right": "0", "bottom": "0", "left": "0" }
  }
}
```

### Button with Icon

```json
{
  "settings": {
    "text": "Download",
    "icon": {
      "library": "fontawesome",
      "icon": "fas fa-download"
    },
    "iconPosition": "left",
    "iconGap": "8px"
  }
}
```

---

## Text Link

Inline text link element.

```json
{
  "id": "lnk001",
  "name": "text-link",
  "parent": "txt001",
  "children": [],
  "settings": {
    "text": "Learn more",
    "link": {
      "type": "external",
      "url": "/about"
    },
    "_typography": {
      "color": { "raw": "var(--primary)" },
      "text-decoration": "underline"
    }
  }
}
```

---

## Nav Menu (Nestable)

Navigation menu element for headers.

```json
{
  "id": "nav001",
  "name": "nav-nestable",
  "parent": "con001",
  "children": ["nvi001", "nvi002", "nvi003"],
  "settings": {
    "_display": "flex",
    "_direction": "row",
    "_columnGap": "var(--space-l)",
    "_alignItems": "center"
  }
}
```

### Nav Item

```json
{
  "id": "nvi001",
  "name": "block",
  "parent": "nav001",
  "children": ["nvl001"],
  "settings": {}
}
```

### Nav Link

```json
{
  "id": "nvl001",
  "name": "text-link",
  "parent": "nvi001",
  "children": [],
  "settings": {
    "text": "About",
    "link": { "type": "internal", "url": "/about" },
    "_typography": {
      "color": { "raw": "var(--base)" },
      "font-weight": "500"
    }
  }
}
```

### Mobile Menu Toggle

```json
{
  "id": "hmb001",
  "name": "div",
  "parent": "con001",
  "children": ["ico001"],
  "settings": {
    "_display": "none",
    "_display:mobile_portrait": "flex",
    "_cursor": "pointer"
  },
  "label": "Hamburger Menu"
}
```

---

## Form

Contact form element.

```json
{
  "id": "frm001",
  "name": "form",
  "parent": "con001",
  "children": [],
  "settings": {
    "fields": [
      {
        "type": "text",
        "label": "Name",
        "placeholder": "Your name",
        "required": true
      },
      {
        "type": "email",
        "label": "Email",
        "placeholder": "your@email.com",
        "required": true
      },
      {
        "type": "textarea",
        "label": "Message",
        "placeholder": "Your message",
        "required": true
      }
    ],
    "submitText": "Send Message",
    "emailTo": "info@example.com",
    "_rowGap": "var(--space-m)"
  }
}
```

### Form Field Types

| Type | Description |
|------|-------------|
| `text` | Single line text |
| `email` | Email input |
| `tel` | Phone input |
| `textarea` | Multi-line text |
| `select` | Dropdown |
| `checkbox` | Checkbox |
| `radio` | Radio buttons |
| `file` | File upload |

### Styled Form

```json
{
  "settings": {
    "_cssCustom": "#brxe-frm001 input, #brxe-frm001 textarea {\n  background: var(--white);\n  border: var(--border);\n  border-radius: var(--radius);\n  padding: var(--space-s) var(--space-m);\n  font-size: var(--text-m);\n}\n\n#brxe-frm001 input:focus, #brxe-frm001 textarea:focus {\n  border-color: var(--primary);\n  outline: none;\n}\n\n#brxe-frm001 button[type='submit'] {\n  background: var(--primary);\n  color: var(--white);\n  padding: var(--space-s) var(--space-l);\n  border-radius: var(--radius);\n  cursor: pointer;\n}"
  }
}
```

---

## Accordion

Expandable content sections.

```json
{
  "id": "acc001",
  "name": "accordion-nested",
  "parent": "con001",
  "children": ["aci001", "aci002", "aci003"],
  "settings": {
    "openFirst": true,
    "toggleIcon": {
      "library": "fontawesome",
      "icon": "fas fa-chevron-down"
    }
  }
}
```

### Accordion Item

```json
{
  "id": "aci001",
  "name": "block",
  "parent": "acc001",
  "children": ["ach001", "acp001"],
  "settings": {
    "_border": {
      "width": { "bottom": "1px" },
      "style": "solid",
      "color": { "raw": "var(--neutral)" }
    }
  },
  "label": "Accordion Item"
}
```

---

## Tabs

Tabbed content sections.

```json
{
  "id": "tab001",
  "name": "tabs-nested",
  "parent": "con001",
  "children": ["tbt001", "tbt002", "tbt003"],
  "settings": {
    "openFirst": true
  }
}
```

---

## Social Icons

Group of social media icon links.

```json
{
  "id": "soc001",
  "name": "div",
  "parent": "con001",
  "children": ["sci001", "sci002", "sci003"],
  "settings": {
    "_display": "flex",
    "_direction": "row",
    "_columnGap": "var(--space-s)",
    "_alignItems": "center"
  },
  "label": "Social Icons"
}
```

### Social Icon Link

```json
{
  "id": "sci001",
  "name": "icon",
  "parent": "soc001",
  "children": [],
  "settings": {
    "icon": { "library": "fontawesome", "icon": "fab fa-facebook-f" },
    "iconSize": "20",
    "iconColor": { "raw": "var(--base)" },
    "link": { "type": "external", "url": "https://facebook.com/yourpage" },
    "_cssCustom": "#brxe-sci001:hover {\n  color: var(--primary);\n}"
  }
}
```

### Common Social Icons

| Platform | Icon |
|----------|------|
| Facebook | `fab fa-facebook-f` |
| Instagram | `fab fa-instagram` |
| Twitter/X | `fab fa-x-twitter` |
| LinkedIn | `fab fa-linkedin-in` |
| YouTube | `fab fa-youtube` |
| TikTok | `fab fa-tiktok` |

---

## Interactive Element Best Practices

### Button Hierarchy

1. **Primary** - Main action (filled, brand color)
2. **Secondary** - Alternative action (outline)
3. **Tertiary** - Minor action (text/ghost)

### Touch Targets

Minimum 44x44px for touch devices:

```json
{
  "_minHeight": "44px",
  "_minWidth": "44px"
}
```

### Focus States

Always include focus styles for accessibility:

```json
{
  "_cssCustom": "#brxe-btn001:focus {\n  outline: 2px solid var(--primary);\n  outline-offset: 2px;\n}"
}
```

### Hover Effects

```json
{
  "_cssCustom": "#brxe-btn001 {\n  transition: all 0.3s ease;\n}\n\n#brxe-btn001:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px var(--base-trans-20);\n}"
}
```
