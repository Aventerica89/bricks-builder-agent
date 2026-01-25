# Frames/ACSS Naming Patterns for Bricks Builder

**Extracted:** 2026-01-25
**Context:** Patterns from Frames (getframes.io) template library for ACSS + Bricks Builder

## Problem

When generating Bricks Builder JSON, need consistent, professional naming conventions that:
- Avoid conflicts with existing site styles
- Follow industry BEM standards
- Work seamlessly with AutomaticCSS variables
- Are memorable and organized

## Solution: Frames Naming Conventions

### 1. Geographic Component Naming

Frames uses **city names** to identify layout variants:
- `Hero Barcelona` - A specific hero style
- `Header London` - A specific header style
- `Feature Section Milan` - A specific feature layout
- `Slider Section Basel` - A specific slider style

This creates memorable, distinctive identifiers while maintaining clarity.

### 2. BEM Class Structure

```
fr-{component}-{variant}__{element}--{modifier}
```

**Examples from Frames:**
- `.fr-notification-alpha` - Block (component + variant)
- `.fr-notification-alpha__inner` - Element
- `.fr-hero-barcelona__title` - Element of specific variant
- `.fr-card--featured` - Modifier

### 3. Prefix Convention

Use a short prefix to namespace all classes:
- `fr-` = Frames
- `jb-` = Custom prefix (our convention)
- `brxw-` = Bricks wireframe templates

### 4. ACSS Variable Integration

Always use ACSS variables within custom classes:

```css
.jb-card {
  background-color: var(--base-dark);
  border-radius: var(--radius);
  padding: var(--space-m);
}

.jb-card__content {
  font-size: var(--text-s);
  gap: var(--card-gap);
}

.jb-card__title {
  font-size: var(--h4);
  color: var(--heading-color);
}

.jb-card--featured {
  border: var(--border);
  border-color: var(--primary);
}
```

### 5. Responsive Breakpoints

Frames follows ACSS breakpoints:
- Desktop (default)
- 991px (tablet)
- 767px (mobile landscape)  
- 478px (mobile portrait)

In Bricks JSON, use:
- `:tablet_portrait` (~1024px)
- `:mobile_landscape` (~768px)
- `:mobile_portrait` (~480px)

## Naming Pattern Templates

### Sections
```
jb-{section-type}
jb-{section-type}__{element}
```
Examples:
- `jb-hero`, `jb-hero__title`, `jb-hero__cta`
- `jb-features`, `jb-features__grid`, `jb-features__item`

### Cards
```
jb-{card-type}-card
jb-{card-type}-card__{element}
```
Examples:
- `jb-gallery-card`, `jb-gallery-card__image`, `jb-gallery-card__title`
- `jb-testimonial-card`, `jb-testimonial-card__quote`

### Headers/Footers
```
jb-header, jb-header__nav, jb-header__logo
jb-footer, jb-footer__links, jb-footer__copyright
```

### Variant Naming (Geographic Style)
For multiple versions of same component:
```
jb-hero-centered
jb-hero-split
jb-hero-barcelona (geographic variant)
jb-hero-london (geographic variant)
```

## When to Use

- Generating Bricks Builder JSON for any section
- Creating reusable global classes
- Naming elements in the Bricks structure panel
- Building component libraries

## Sources

- [Frames - Bricks Builder Templates](https://getframes.io/)
- [AutomaticCSS](https://automaticcss.com/)
- [Bricks Forum - BEM Naming Discussion](https://forum.bricksbuilder.io/t/ideal-bem-class-naming-for-shareable-elements-layouts/35021)
- [Learn Bricks Builder - BEM Guide](https://learnbricksbuilder.com/a-beginners-guide-to-bem-naming/)
