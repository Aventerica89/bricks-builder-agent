# AutomaticCSS (ACSS) Variables Reference

Complete reference for all AutomaticCSS variables available for use in Bricks Builder.

## Typography Variables

### Heading Sizes

| Variable | Description |
|----------|-------------|
| `var(--h1)` | Largest heading, page titles |
| `var(--h2)` | Section headings |
| `var(--h3)` | Subsection headings |
| `var(--h4)` | Small headings |
| `var(--h5)` | Eyebrow text |
| `var(--h6)` | Smallest heading |

### Text Sizes

| Variable | Description |
|----------|-------------|
| `var(--text-xxl)` | Extra extra large text |
| `var(--text-xl)` | Extra large text, intro paragraphs |
| `var(--text-l)` | Large text, subheadings |
| `var(--text-m)` | Medium text, standard body |
| `var(--text-s)` | Small text, captions |
| `var(--text-xs)` | Extra small, fine print |

### Global Typography Properties

| Variable | Description |
|----------|-------------|
| `var(--heading-font-family)` | Heading font family |
| `var(--heading-color)` | Default heading color |
| `var(--heading-line-height)` | Heading line height |
| `var(--heading-font-weight)` | Heading font weight |
| `var(--text-font-family)` | Body text font family |
| `var(--text-color)` | Default text color |
| `var(--text-line-height)` | Body text line height |
| `var(--text-font-weight)` | Body text font weight |

## Spacing Variables

### Standard Spacing (Content Gaps)

| Variable | Typical Use |
|----------|-------------|
| `var(--space-xs)` | Tiny gaps (4-8px), icon margins |
| `var(--space-s)` | Small gaps (8-16px), button padding |
| `var(--space-m)` | Medium gaps (16-24px), card padding |
| `var(--space-l)` | Large gaps (24-40px), content spacing |
| `var(--space-xl)` | Extra large (40-60px), major spacing |
| `var(--space-xxl)` | Huge gaps (60-80px), section separation |

### Section Spacing (Vertical Padding)

| Variable | Typical Use |
|----------|-------------|
| `var(--section-space-xs)` | Minimal section padding |
| `var(--section-space-s)` | Small section padding |
| `var(--section-space-m)` | Medium section padding |
| `var(--section-space-l)` | Standard section padding |
| `var(--section-space-xl)` | Large section padding |
| `var(--section-space-xxl)` | Maximum section padding |

### Contextual Spacing

| Variable | Description |
|----------|-------------|
| `var(--grid-gap)` | Standard grid gap |
| `var(--card-gap)` | Gap for card layouts |
| `var(--content-gap)` | Content element gaps |

## Color Variables

### Primary Colors

| Variable | Description |
|----------|-------------|
| `var(--primary)` | Main brand color |
| `var(--secondary)` | Second brand color |
| `var(--tertiary)` | Third brand color |
| `var(--accent)` | Accent/highlight color |
| `var(--base)` | Base color (dark, for text/bg) |
| `var(--neutral)` | Neutral gray |

### Color Shades

For each main color, these shade variants are available:

| Modifier | Example | Description |
|----------|---------|-------------|
| `-ultra-light` | `var(--primary-ultra-light)` | Lightest shade |
| `-light` | `var(--primary-light)` | Light shade |
| `-semi-light` | `var(--primary-semi-light)` | Slightly light |
| (none) | `var(--primary)` | Base color |
| `-semi-dark` | `var(--primary-semi-dark)` | Slightly dark |
| `-dark` | `var(--primary-dark)` | Dark shade |
| `-ultra-dark` | `var(--primary-ultra-dark)` | Darkest shade |
| `-hover` | `var(--primary-hover)` | Hover state |

### Transparency Variants

For each color and shade, transparency is available (10-90 in increments of 10):

| Variable | Description |
|----------|-------------|
| `var(--primary-trans-10)` | 10% opacity |
| `var(--primary-trans-20)` | 20% opacity |
| `var(--primary-trans-30)` | 30% opacity |
| `var(--primary-trans-40)` | 40% opacity |
| `var(--primary-trans-50)` | 50% opacity |
| `var(--primary-trans-60)` | 60% opacity |
| `var(--primary-trans-70)` | 70% opacity |
| `var(--primary-trans-80)` | 80% opacity |
| `var(--primary-trans-90)` | 90% opacity |

Combined example: `var(--base-dark-trans-70)` = dark base at 70% opacity

### Utility Colors

| Variable | Description |
|----------|-------------|
| `var(--white)` | Pure white |
| `var(--black)` | Pure black |
| `var(--white-trans-50)` | White at 50% opacity |
| `var(--black-trans-50)` | Black at 50% opacity |

### Background Assignment Variables

| Variable | Description |
|----------|-------------|
| `var(--bg-light)` | Light background |
| `var(--bg-dark)` | Dark background |
| `var(--bg-ultra-light)` | Very light background |
| `var(--bg-ultra-dark)` | Very dark background |

### Text Color on Backgrounds

| Variable | Description |
|----------|-------------|
| `var(--text-light)` | Text for dark backgrounds |
| `var(--text-dark)` | Text for light backgrounds |

## Border Variables

| Variable | Description |
|----------|-------------|
| `var(--radius)` | Global border radius |
| `var(--radius-s)` | Small border radius |
| `var(--radius-m)` | Medium border radius |
| `var(--radius-l)` | Large border radius |
| `var(--radius-circle)` | Circular (50%) |
| `var(--border)` | Complete border (width + style + color) |
| `var(--border-size)` | Border width |
| `var(--border-style)` | Border style |
| `var(--border-color-light)` | Border color for light theme |
| `var(--border-color-dark)` | Border color for dark theme |

## Layout Variables

| Variable | Description |
|----------|-------------|
| `var(--content-width)` | Website content width |
| `var(--website-width)` | Full website width |

## Breakout Classes

ACSS provides utility classes to break elements out of their parent container:

| Class | Description |
|-------|-------------|
| `breakout--s` | Break out to 60vw |
| `breakout--m` | Break out to 70vw |
| `breakout--l` | Break out to 80vw |
| `breakout--xl` | Break out to 90vw |
| `breakout--full` | Break out to 100vw (full viewport width) |

### CSS Implementation

```css
.breakout--full {
  inline-size: 100vw !important;
  max-inline-size: 100vw !important;
  margin-inline: calc(-50vw + 50%) !important;
  align-self: flex-start;
}

.breakout--{s|m|l|xl} {
  inline-size: {60|70|80|90}vw !important;
  max-inline-size: {60|70|80|90}vw !important;
  margin: 0 calc(-{30|35|40|45}vw + 50%) !important;
}
```

### Usage in Bricks JSON

Apply breakout class via `_cssGlobalClasses`:

```json
{
  "id": "sec001",
  "name": "section",
  "settings": {
    "_cssGlobalClasses": ["breakout--full"]
  }
}
```

Or for a div inside a container:

```json
{
  "id": "div001",
  "name": "div",
  "settings": {
    "_cssGlobalClasses": ["breakout--full"],
    "_background": {
      "color": { "raw": "var(--base)" }
    }
  }
}
```

**Note:** Breakout classes work by using negative margins to pull the element outside its container. The element must be inside a centered container for this to work properly.

## Grid Variables

### Standard Grids

| Variable | Description |
|----------|-------------|
| `var(--grid-1)` | 1 column |
| `var(--grid-2)` | 2 columns |
| `var(--grid-3)` | 3 columns |
| `var(--grid-4)` | 4 columns |
| `var(--grid-5)` | 5 columns |
| `var(--grid-6)` | 6 columns |
| `var(--grid-12)` | 12 columns |

### Unbalanced Grids

| Variable | Description |
|----------|-------------|
| `var(--grid-1-2)` | 1:2 ratio (33% / 66%) |
| `var(--grid-2-1)` | 2:1 ratio (66% / 33%) |
| `var(--grid-1-3)` | 1:3 ratio (25% / 75%) |
| `var(--grid-3-1)` | 3:1 ratio (75% / 25%) |
| `var(--grid-2-3)` | 2:3 ratio (40% / 60%) |
| `var(--grid-3-2)` | 3:2 ratio (60% / 40%) |

## MedSpaRanker Color Mapping

For the medsparanker.com site, map these values:

| ACSS Variable | Hex Value | Use |
|---------------|-----------|-----|
| `var(--primary)` | #E56C70 | Coral red - CTAs, accents |
| `var(--secondary)` | #42B9F1 | Bright blue - Links |
| `var(--accent)` | #18a4b9 | Teal - Secondary accents |
| `var(--base)` | #00040A | Near black - Text, dark bg |
| `var(--neutral)` | #D5D8DD | Light gray - Borders |
| `var(--white)` | #ffffff | White backgrounds |

## Usage in Bricks JSON

### Colors

```json
{
  "_background": {
    "color": { "raw": "var(--primary)" }
  },
  "_typography": {
    "color": { "raw": "var(--white)" }
  },
  "_border": {
    "color": { "raw": "var(--neutral)" }
  }
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
  "_rowGap": "var(--space-m)",
  "_columnGap": "var(--grid-gap)"
}
```

### Typography

```json
{
  "_typography": {
    "font-size": "var(--h2)",
    "font-weight": "700",
    "line-height": "var(--heading-line-height)"
  }
}
```

### Border Radius

```json
{
  "_border": {
    "radius": {
      "top": "var(--radius)",
      "right": "var(--radius)",
      "bottom": "var(--radius)",
      "left": "var(--radius)"
    }
  }
}
```

### Gradients with Transparency

```json
{
  "_gradient": {
    "angle": "180",
    "colors": [
      {
        "id": "g1",
        "color": { "raw": "var(--base-trans-80)" },
        "stop": "0"
      },
      {
        "id": "g2",
        "color": { "raw": "var(--base-trans-20)" },
        "stop": "100"
      }
    ]
  }
}
```

## Best Practices

1. **Never hardcode colors** - Always use ACSS variables
2. **Use semantic spacing** - `var(--space-m)` over `20px`
3. **Section padding** - Use `var(--section-space-*)` for top/bottom
4. **Content spacing** - Use `var(--space-*)` for internal gaps
5. **Typography scale** - Use `var(--h*)` and `var(--text-*)` for sizes
6. **Transparency for overlays** - Use `-trans-*` variants
7. **Consistent borders** - Use `var(--radius)` globally
