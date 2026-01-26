# Bricks Builder: Every Element Needs a Global Class

**Extracted:** January 2025
**Context:** Generating Bricks Builder JSON exports with proper styling architecture

## Problem

When generating Bricks Builder JSON, I was inconsistently applying global classes:
- Some elements had classes (blocks, divs, major containers)
- Some elements had NO class (section, container, icons, individual text spans)

This creates problems:
1. **No styling hooks** - Can't target elements for future style changes
2. **Inconsistent with Frames patterns** - Frames applies classes to EVERY element
3. **Maintenance issues** - Have to add classes later when styling needs change
4. **Breaks BEM methodology** - Incomplete component class structure

## Solution

**EVERY element in Bricks Builder JSON must have at least one global class.**

No exceptions. Even if the element has no custom styles, give it a class.

### Class Naming by Element Type

| Element | Class Pattern | Example |
|---------|---------------|---------|
| Section | `{prefix}-{component}` | `sm-gallery` |
| Container | `{prefix}-{component}__container` | `sm-gallery__container` |
| Div/Block (wrapper) | `{prefix}-{component}__wrapper` | `sm-gallery__wrapper` |
| Heading | `{prefix}-{component}__title` | `sm-gallery__title` |
| Text | `{prefix}-{component}__text` | `sm-gallery__text` |
| Image | `{prefix}-{component}__image` | `sm-gallery__image` |
| Icon | `{prefix}-{component}__icon` | `sm-gallery__icon` |
| Button | `{prefix}-{component}__btn` | `sm-gallery__btn` |

### For Small/Repeated Elements

Even small elements like icons inside meta items need classes:

```json
{
  "id": "icon01",
  "name": "icon",
  "settings": {
    "_cssGlobalClasses": ["sm-gallery__meta-icon"]
  }
}
```

### Global Classes Array Must Exist

Even if using only ACSS utility classes:

```json
{
  "_cssGlobalClasses": ["sm-gallery__section"]
}
```

## Example

### WRONG (Missing Classes)

```json
{
  "id": "sec001",
  "name": "section",
  "settings": {
    "_padding": {...}
  }
}
```

### CORRECT (Every Element Has Class)

```json
{
  "id": "sec001", 
  "name": "section",
  "settings": {
    "_cssGlobalClasses": ["sm-gallery"],
    "_padding": {...}
  }
}
```

## Checklist Before Output

Before generating Bricks JSON, verify:

- [ ] Section has `{prefix}-{component}` class
- [ ] Container has `__container` class
- [ ] Every div/block has a BEM element class
- [ ] Every heading has `__title` or `__heading` class
- [ ] Every text element has descriptive class
- [ ] Every image has `__image` or `__media` class
- [ ] Every icon has `__icon` class
- [ ] Every button has `__btn` or `__cta` class
- [ ] globalClasses array includes definitions for ALL referenced classes

## When to Use

Apply this pattern ALWAYS when:
- Generating Bricks Builder JSON
- Creating section templates
- Building component patterns
- Converting screenshots to Bricks JSON

## Reference

Frames pattern example - note EVERY element has a class:
```
Container: ["fr-feature-grid-golf", "list--none"]
Block: ["fr-feature-card-golf"]
Image: ["fr-feature-card-golf__media"]
Block: ["fr-feature-card-golf__overlay"]
Heading: ["clickable-parent", "fr-feature-card-golf__heading"]
Text: ["fr-feature-card-golf__description"]
```
