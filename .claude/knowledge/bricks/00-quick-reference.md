# Bricks Builder Quick Reference

Fast lookup for the most common patterns covering 80% of use cases.

## Most Used Elements

| Element | Name | Use For |
|---------|------|---------|
| Section | `section` | Page sections, always root level |
| Container | `container` | Width-constrained wrapper (default 1100px) |
| Block | `block` | Flex container, 100% width |
| Div | `div` | Generic wrapper, no default styles |
| Heading | `heading` | h1-h6 headings |
| Text Basic | `text-basic` | Single line/paragraph text |
| Rich Text | `rich-text` | Multi-paragraph with HTML |
| Image | `image` | Single images |
| Button | `button` | Clickable buttons |
| Icon | `icon` | FontAwesome, Ionicons, Themify icons |

## Essential Settings

### Layout Settings

```json
{
  "_display": "flex",
  "_direction": "row",
  "_justifyContent": "center",
  "_alignItems": "center",
  "_flexWrap": "wrap",
  "_rowGap": "var(--space-m)",
  "_columnGap": "var(--space-m)"
}
```

### Grid Layout

```json
{
  "_display": "grid",
  "_gridTemplateColumns": "repeat(3, 1fr)",
  "_gridGap": "var(--grid-gap)"
}
```

### Spacing

```json
{
  "_padding": {
    "top": "var(--section-space-l)",
    "right": "var(--space-m)",
    "bottom": "var(--section-space-l)",
    "left": "var(--space-m)"
  },
  "_margin": {
    "top": "0",
    "bottom": "var(--space-l)"
  }
}
```

### Typography

```json
{
  "_typography": {
    "font-size": "var(--h2)",
    "font-weight": "700",
    "line-height": "1.2",
    "color": { "raw": "var(--base)" },
    "text-align": "center"
  }
}
```

### Background

```json
{
  "_background": {
    "color": { "raw": "var(--primary)" },
    "image": {
      "url": "https://example.com/image.jpg",
      "size": "cover",
      "position": "center center"
    }
  }
}
```

### Border

```json
{
  "_border": {
    "width": { "top": "1px", "right": "1px", "bottom": "1px", "left": "1px" },
    "style": "solid",
    "color": { "raw": "var(--neutral)" },
    "radius": { "top": "var(--radius)", "right": "var(--radius)", "bottom": "var(--radius)", "left": "var(--radius)" }
  }
}
```

## Quick Patterns

### Centered Hero

```
section
└── container (_justifyContent: center, _alignItems: center, _textAlign: center)
    ├── heading (h1)
    ├── text-basic (subheading)
    └── button (CTA)
```

### Two-Column Split

```
section
└── container (_display: grid, _gridTemplateColumns: 1fr 1fr)
    ├── block (text content)
    │   ├── heading
    │   ├── text-basic
    │   └── button
    └── block (image)
        └── image
```

### Card Grid

```
section
└── container
    └── block (_display: grid, _gridTemplateColumns: repeat(3, 1fr))
        └── div [hasLoop: true] (card)
            ├── image
            ├── heading (h3)
            └── text-basic
```

### Header Nav

```
section
└── container (_display: flex, _justifyContent: space-between, _alignItems: center)
    ├── image (logo)
    ├── nav-nestable (menu)
    └── button (CTA)
```

## ACSS Spacing Scale

| Variable | Typical Use |
|----------|-------------|
| `var(--space-xs)` | Small gaps, icon margins |
| `var(--space-s)` | Tight spacing, button padding |
| `var(--space-m)` | Standard spacing, card padding |
| `var(--space-l)` | Section internal spacing |
| `var(--space-xl)` | Large gaps between sections |
| `var(--space-xxl)` | Major section spacing |
| `var(--section-space-s)` | Small section padding |
| `var(--section-space-m)` | Medium section padding |
| `var(--section-space-l)` | Standard section padding |
| `var(--section-space-xl)` | Large section padding |

## ACSS Typography Scale

| Variable | Use For |
|----------|---------|
| `var(--h1)` | Page titles, hero headings |
| `var(--h2)` | Section headings |
| `var(--h3)` | Subsection headings, card titles |
| `var(--h4)` | Small headings |
| `var(--h5)` | Eyebrow text, labels |
| `var(--h6)` | Smallest headings |
| `var(--text-xxl)` | Large body text |
| `var(--text-xl)` | Intro paragraphs |
| `var(--text-l)` | Subheadings |
| `var(--text-m)` | Standard body text |
| `var(--text-s)` | Small text, captions |
| `var(--text-xs)` | Fine print, labels |

## ACSS Color Modifiers

Base colors: `primary`, `secondary`, `accent`, `base`, `neutral`

| Modifier | Example |
|----------|---------|
| (none) | `var(--primary)` |
| `-light` | `var(--primary-light)` |
| `-dark` | `var(--primary-dark)` |
| `-ultra-light` | `var(--primary-ultra-light)` |
| `-ultra-dark` | `var(--primary-ultra-dark)` |
| `-trans-50` | `var(--primary-trans-50)` |

## Responsive Suffixes

| Suffix | Breakpoint |
|--------|------------|
| (none) | Desktop (default) |
| `:tablet_portrait` | ~1024px and below |
| `:mobile_landscape` | ~768px and below |
| `:mobile_portrait` | ~480px and below |

Example responsive setting:

```json
{
  "_gridTemplateColumns": "repeat(3, 1fr)",
  "_gridTemplateColumns:tablet_portrait": "repeat(2, 1fr)",
  "_gridTemplateColumns:mobile_portrait": "repeat(1, 1fr)"
}
```

## ID Generation

- 6 characters
- Lowercase letters (a-z) + numbers (0-9)
- Examples: `abc123`, `hro001`, `crd4x7`
- Must be unique within output

## Global Class Naming (BEM)

```
jb-{block}
jb-{block}__{element}
jb-{block}--{modifier}
jb-{block}__{element}--{modifier}
```

Examples:
- `jb-hero`
- `jb-hero__title`
- `jb-hero__cta`
- `jb-hero__cta--secondary`
- `jb-card`
- `jb-card__image`
- `jb-card--featured`
