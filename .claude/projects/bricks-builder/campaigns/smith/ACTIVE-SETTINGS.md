# Smith Campaign - ACSS Active Settings Reference

Use ONLY these active classes and variables in the build.
Disabled utilities are listed at the bottom - DO NOT USE THEM.

## Color Palette

| Color | Hex | HSL | Alt Hex |
|-------|-----|-----|---------|
| primary | #cf202f | hsl(355, 73%, 25%) | #5b99a6 |
| secondary | #1e356c | hsl(222, 57%, 25%) | #1c1930 |
| accent | #eabb2d | hsl(45, 82%, 25%) | #bcc8a2 |
| base | #1e356c | hsl(221, 57%, 25%) | #0a2434 |
| neutral | #00040a | hsl(216, 10%, 25%) | #ffffff |
| action | #cf202f | hsl(355, 73%, 25%) | #32a2c1 |
| success | #29a844 | hsl(133, 61%, 15%) | #29A745 |
| warning | #ffc20a | hsl(45, 100%, 15%) | #FFC10A |
| danger | #DC3545 | hsl(354, 71%, 15%) | #DC3545 |
| info | #18a4b9 | hsl(188, 77%, 15%) | #18A2B8 |

### Color Variables Available
```css
/* Primary */
--primary: #cf202f;
--primary-hover, --primary-dark, --primary-light, --primary-ultra-dark, --primary-ultra-light

/* Secondary */
--secondary: #1e356c;
--secondary-hover, --secondary-dark, --secondary-light

/* Accent */
--accent: #eabb2d;
--accent-hover, --accent-dark, --accent-light

/* Neutral */
--neutral: #00040a;
--neutral-hover, --neutral-dark, --neutral-light, --neutral-ultra-dark, --neutral-ultra-light

/* Base */
--base: #1e356c;
--base-hover, --base-dark, --base-light

/* Semantic */
--success, --warning, --danger, --info (and variants)
```

## Typography

### Base Settings
- Base space: 30px (min: 24px)
- Space scale: 1.5 (mobile: 1.333)
- Body max width: 1920px

## Active Button Styles

### Available Button Classes
```css
/* Primary buttons */
.btn--primary
.btn--primary.btn--outline

/* Secondary buttons */
.btn--secondary
.btn--secondary.btn--outline

/* Neutral buttons */
.btn--neutral
.btn--neutral.btn--outline

/* Action buttons */
.btn--action

/* Base buttons */
.btn--base
.btn--base.btn--outline

/* Black/White buttons */
.btn--black
.btn--white
```

### Button Variables
- Border radius: var(--radius-m)
- Padding X: 1.5em
- Padding Y: 0.75em

## Enabled Features (USE THESE)

### Layout
- **Auto Grid**: `.grid--auto-*` classes
- **Flex Grids**: `.grid--flex-*` classes
- **Columns**: `.col-*` classes
- **Content Grid**: `.content-grid`, `.breakout`, `.full-bleed`
- **Container Queries**: `@container` support

### Spacing
- **Smart Spacing**: Automatic spacing based on context
- **Section Padding**: `.section--*` padding classes
- Section space adjustment: 3

### Visual
- **Backgrounds**: `.bg--*` classes
- **Box Shadows**: `.shadow--*` classes
- **Textures**: `.texture--*` classes
- **Gradient Fades**: `.gradient-fade--*` classes
- **Corner Ribbons**: `.ribbon--*` classes

### Text
- **Divider Classes**: `.divider--*`
- **Line Clamp**: `.line-clamp-*` classes

### Forms
- **Form Styling**: Full form support enabled
- Input height: 50px
- Input border radius: var(--btn-radius)

### Accessibility
- **Accessibility Classes**: `.sr-only`, `.focus-visible`, etc.
- **Reduce Motion**: Respects `prefers-reduced-motion`
- **Smooth Scrolling**: Enabled

### Frames Integration
- Accordion Widget
- Modal Widget
- Notes Widget
- Slider Controls Widget
- Slider Widget
- Tabs Widget
- TOC Widget
- Trigger Widget

## DISABLED - DO NOT USE

These utility classes are NOT active in this build:

| Disabled | Classes | Alternative |
|----------|---------|-------------|
| Card Components | `.card-*` | Use custom card styles |
| Aspect Ratios | `.aspect-*` | Use CSS `aspect-ratio` property |
| Margin Utilities | `.m-*`, `.mt-*`, `.mb-*`, etc. | Use Bricks spacing controls |
| Padding Utilities | `.p-*`, `.pt-*`, `.pb-*`, etc. | Use Bricks spacing controls |
| Gap Utilities | `.gap-*` | Use grid-gap/container-gap vars |
| Flex Utilities | `.flex-*`, `.justify-*`, `.align-*` | Use Bricks flex controls |
| Grid Utilities | `.grid-*` (not auto-grid) | Use auto-grid or Bricks |
| Width Utilities | `.w-*` | Use Bricks width controls |
| Height Utilities | `.h-*` | Use Bricks height controls |
| Display Utilities | `.d-*`, `.d-none`, `.d-block` | Use Bricks display controls |
| Position Utilities | `.pos-*`, `.pos-relative` | Use Bricks position controls |
| Visibility Utilities | `.v-*`, `.v-hidden` | Use Bricks or CSS |
| Z-Index Utilities | `.z-*` | Use CSS z-index directly |
| Overlay Utilities | `.overlay-*` | Use custom overlay CSS |
| Icon Utilities | `.icon-*` | Style icons directly |
| Border Classes | `.border-*` | Use Bricks border controls |
| Rounded Utilities | `.radius-*` | Use --radius-* variables |
| Opacity Utilities | `.o-*` | Use CSS opacity directly |
| Centering Utilities | `.center-*` | Use flexbox/grid centering |
| Owl Spacing | `.owl-*` | Use smart spacing instead |
