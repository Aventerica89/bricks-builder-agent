# Proper Image Card/Column Pattern (Frames Golf Style)

## Key Principle

**DO NOT use Bricks background settings for card images.**

Use an actual `<image>` element with absolute positioning to act as the background. This is proper HTML and provides:
- Better accessibility (alt text)
- Proper image loading/lazy loading
- SEO benefits
- More control over image behavior

---

## Structure Pattern

```
Container (ul) - Grid wrapper
└── Block (li) - Card (position: relative)
    ├── Image (figure) - Acts as background (position: absolute, inset: 0, z-index: -1)
    └── Block - Overlay/Content wrapper (position: absolute, inset: 0)
        ├── Heading (h3) - with clickable-parent for full card link
        └── Text - Description
```

---

## Critical CSS Classes

### Card Container
```css
.fr-feature-card-golf {
  min-height: 25em;
  overflow: hidden;
  border-radius: var(--radius);
  position: relative;
  isolation: isolate;  /* Creates stacking context */
  transition: transform .6s ease;
}

.fr-feature-card-golf:hover {
  transform: translateY(-0.75em);
}

/* Optional: blur image on hover */
.fr-feature-card-golf:hover .feature-card-golf__image {
  filter: blur(25px);
}
```

### Image as Background
```css
.fr-feature-card-golf__media {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;  /* Behind content */
}
```

### Content Overlay
```css
.fr-feature-card-golf__overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: var(--space-l);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: calc(var(--content-gap) / 2);
  background: var(--black-trans-60);
  color: var(--white);
  text-align: center;
}
```

---

## Bricks JSON Structure

### Grid Container
```json
{
  "id": "grid01",
  "name": "container",
  "parent": 0,
  "children": ["card01", "card02", "card03"],
  "settings": {
    "_cssGlobalClasses": ["fr-feature-grid-golf", "list--none"],
    "tag": "custom",
    "customTag": "ul"
  },
  "label": "Feature Grid"
}
```

### Card (List Item)
```json
{
  "id": "card01",
  "name": "block",
  "parent": "grid01",
  "children": ["img001", "ovrl01"],
  "settings": {
    "_cssGlobalClasses": ["fr-feature-card-golf"],
    "tag": "custom",
    "customTag": "li"
  },
  "label": "Feature Card"
}
```

### Image Element (NOT background)
```json
{
  "id": "img001",
  "name": "image",
  "parent": "card01",
  "children": [],
  "settings": {
    "image": {
      "url": "{image_url}",
      "alt": "Description of image"
    },
    "_cssGlobalClasses": ["fr-feature-card-golf__media"],
    "tag": "figure"
  }
}
```

### Content Overlay
```json
{
  "id": "ovrl01",
  "name": "block",
  "parent": "card01",
  "children": ["hdg001", "txt001"],
  "settings": {
    "_cssGlobalClasses": ["fr-feature-card-golf__overlay"]
  },
  "label": "Overlay"
}
```

### Heading with Clickable Parent
```json
{
  "id": "hdg001",
  "name": "heading",
  "parent": "ovrl01",
  "children": [],
  "settings": {
    "text": "Feature heading",
    "link": {
      "type": "external",
      "url": "#"
    },
    "_cssGlobalClasses": ["clickable-parent", "fr-feature-card-golf__heading"],
    "tag": "h3"
  }
}
```

---

## Global Classes Reference

| Class | Purpose |
|-------|---------|
| `fr-feature-grid-golf` | Grid container with responsive columns |
| `list--none` | ACSS class to remove list styling |
| `fr-feature-card-golf` | Card with relative positioning, hover effects |
| `fr-feature-card-golf__media` | Image positioned as background |
| `fr-feature-card-golf__overlay` | Content overlay with semi-transparent bg |
| `fr-feature-card-golf__heading` | Heading styles |
| `fr-feature-card-golf__description` | Description text styles |
| `clickable-parent` | ACSS class for full-card clickability |

---

## Key Differences from Background Image Approach

| Background Image (Wrong) | Image Element (Correct) |
|--------------------------|-------------------------|
| `_background: { image: {...} }` | `<image>` element with absolute positioning |
| No alt text | Alt text for accessibility |
| Limited loading control | Native lazy loading |
| CSS-only | Proper HTML semantics |
| Harder to style on hover | Easy filter/transform effects |

---

## When to Use This Pattern

- Feature cards with images
- Image galleries with overlays
- Call-to-action cards
- Portfolio grids
- Any card where image fills the background

---

## Source

Frames "Feature Card Golf" pattern from Automatic.css/Frames library.
