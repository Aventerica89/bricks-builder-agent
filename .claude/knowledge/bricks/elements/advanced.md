# Advanced Elements

Sliders, carousels, and complex interactive components.

## Slider (Nestable)

Carousel/slider using Splide.js library.

```json
{
  "id": "sld001",
  "name": "slider-nested",
  "parent": "con001",
  "children": ["sli001", "sli002", "sli003"],
  "settings": {
    "type": "slide",
    "perPage": 1,
    "perMove": 1,
    "speed": "500",
    "autoplay": true,
    "interval": "5000",
    "pauseOnHover": true,
    "arrows": true,
    "pagination": true,
    "gap": "var(--space-m)",
    "height": "500px"
  },
  "label": "Hero Slider"
}
```

### Slider Types

| Type | Description |
|------|-------------|
| `slide` | Standard sliding |
| `loop` | Infinite loop |
| `fade` | Fade transition |

### Common Slider Settings

```json
{
  "type": "slide",
  "perPage": 3,
  "perMove": 1,
  "speed": "500",
  "gap": "var(--grid-gap)",
  "autoplay": false,
  "pauseOnHover": true,
  "arrows": true,
  "pagination": true,
  "breakpoints": {
    "1024": { "perPage": 2 },
    "768": { "perPage": 1 }
  }
}
```

### Slide Item

```json
{
  "id": "sli001",
  "name": "block",
  "parent": "sld001",
  "children": ["img001", "hdg001", "txt001"],
  "settings": {
    "_background": {
      "image": { "url": "...", "size": "cover" }
    },
    "_padding": {
      "top": "var(--space-xl)",
      "right": "var(--space-l)",
      "bottom": "var(--space-xl)",
      "left": "var(--space-l)"
    },
    "_justifyContent": "center",
    "_alignItems": "center"
  },
  "label": "Slide 1"
}
```

### Testimonial Slider

```json
{
  "id": "tsld01",
  "name": "slider-nested",
  "parent": "con001",
  "children": ["tsi001"],
  "settings": {
    "type": "loop",
    "perPage": 3,
    "perPage:tablet_portrait": 2,
    "perPage:mobile_portrait": 1,
    "gap": "var(--grid-gap)",
    "autoplay": true,
    "interval": "5000",
    "arrows": true,
    "pagination": false
  },
  "label": "Testimonials Slider"
}
```

### Slider with Loop Query

```json
{
  "id": "sli001",
  "name": "block",
  "parent": "sld001",
  "children": ["img001", "hdg001"],
  "settings": {
    "hasLoop": true,
    "query": {
      "post_type": ["testimonial"],
      "posts_per_page": "6",
      "orderby": ["date"],
      "order": ["desc"]
    }
  },
  "label": "Testimonial Slide"
}
```

### Arrow Styling

```json
{
  "arrowBackground": { "raw": "var(--white)" },
  "arrowTypography": {
    "color": { "raw": "var(--base)" },
    "font-size": "20px"
  },
  "arrowHeight": "48px",
  "arrowWidth": "48px",
  "arrowBorder": {
    "radius": { "top": "50%", "right": "50%", "bottom": "50%", "left": "50%" }
  },
  "prevArrow": { "library": "fontawesome", "icon": "fas fa-chevron-left" },
  "nextArrow": { "library": "fontawesome", "icon": "fas fa-chevron-right" }
}
```

### Pagination Styling

```json
{
  "paginationColor": { "raw": "var(--neutral)" },
  "paginationColorActive": { "raw": "var(--primary)" },
  "paginationBottom": "20px"
}
```

### Custom Slider Options (JSON)

For advanced configuration:

```json
{
  "optionsType": "custom",
  "options": "{\n  \"type\": \"loop\",\n  \"perPage\": 3,\n  \"gap\": \"20px\",\n  \"breakpoints\": {\n    \"1024\": { \"perPage\": 2 },\n    \"640\": { \"perPage\": 1 }\n  },\n  \"autoplay\": true,\n  \"interval\": 5000\n}"
}
```

---

## Synced Sliders

Two sliders synced together (main + thumbnails).

### Main Slider

```json
{
  "id": "main01",
  "name": "slider-nested",
  "parent": "con001",
  "children": ["msl001"],
  "settings": {
    "type": "fade",
    "speed": "1000",
    "autoplay": true,
    "_cssGlobalClasses": ["sync-slider__main"]
  },
  "label": "Main Slider"
}
```

### Thumbnail Slider

```json
{
  "id": "thum01",
  "name": "slider-nested",
  "parent": "con001",
  "children": ["tsl001"],
  "settings": {
    "optionsType": "custom",
    "options": "{\n  \"type\": \"slide\",\n  \"perPage\": 4,\n  \"gap\": \"10px\",\n  \"isNavigation\": true,\n  \"pagination\": false\n}",
    "_cssGlobalClasses": ["sync-slider__thumbnails"]
  },
  "label": "Thumbnail Slider"
}
```

### Sync JavaScript

```json
{
  "id": "sync01",
  "name": "code",
  "parent": "sec001",
  "children": [],
  "settings": {
    "executeCode": true,
    "javascriptCode": "document.addEventListener('DOMContentLoaded', () => {\n  const main = bricksData.splideInstances['main01'];\n  const thumbs = bricksData.splideInstances['thum01'];\n  if (main && thumbs) {\n    main.sync(thumbs);\n  }\n});"
  }
}
```

---

## Image Gallery

Grid gallery with lightbox.

```json
{
  "id": "gal001",
  "name": "image-gallery",
  "parent": "con001",
  "children": [],
  "settings": {
    "images": [
      { "id": 1, "url": "image1.jpg" },
      { "id": 2, "url": "image2.jpg" },
      { "id": 3, "url": "image3.jpg" }
    ],
    "columns": 3,
    "gap": "var(--space-s)",
    "lightbox": true
  }
}
```

### Gallery with ACF Repeater

```json
{
  "settings": {
    "images": { "useDynamicData": "{acf_gallery_field}" },
    "columns": 4,
    "columns:tablet_portrait": 3,
    "columns:mobile_portrait": 2
  }
}
```

---

## Countdown Timer

Countdown to a specific date.

```json
{
  "id": "cnt001",
  "name": "countdown",
  "parent": "con001",
  "children": [],
  "settings": {
    "date": "2025-12-31 23:59:59",
    "showDays": true,
    "showHours": true,
    "showMinutes": true,
    "showSeconds": true,
    "_typography": {
      "font-size": "var(--h2)",
      "font-weight": "700"
    }
  }
}
```

---

## Counter/Number Animation

Animated counting number.

```json
{
  "id": "num001",
  "name": "counter",
  "parent": "con001",
  "children": [],
  "settings": {
    "countFrom": 0,
    "countTo": 500,
    "prefix": "$",
    "suffix": "M+",
    "duration": 2000,
    "_typography": {
      "font-size": "var(--h1)",
      "font-weight": "700",
      "color": { "raw": "var(--primary)" }
    }
  }
}
```

---

## Progress Bar

Visual progress indicator.

```json
{
  "id": "prg001",
  "name": "progress-bar",
  "parent": "con001",
  "children": [],
  "settings": {
    "percentage": 75,
    "label": "Project Progress",
    "showPercentage": true,
    "barColor": { "raw": "var(--primary)" },
    "backgroundColor": { "raw": "var(--neutral)" },
    "height": "10px",
    "_border": {
      "radius": { "top": "5px", "right": "5px", "bottom": "5px", "left": "5px" }
    }
  }
}
```

---

## Map

Google Maps or Leaflet map.

```json
{
  "id": "map001",
  "name": "map",
  "parent": "con001",
  "children": [],
  "settings": {
    "address": "123 Main St, City, State",
    "zoom": 15,
    "mapType": "roadmap",
    "_height": "400px",
    "_width": "100%",
    "_border": {
      "radius": { "top": "var(--radius)", "right": "var(--radius)", "bottom": "var(--radius)", "left": "var(--radius)" }
    }
  }
}
```

---

## Code Element

Custom HTML/CSS/JavaScript.

```json
{
  "id": "cod001",
  "name": "code",
  "parent": "sec001",
  "children": [],
  "settings": {
    "executeCode": true,
    "code": "<div class=\"custom-element\">Custom HTML</div>",
    "cssCode": ".custom-element {\n  background: var(--primary);\n  padding: var(--space-m);\n}",
    "javascriptCode": "console.log('Custom JS');"
  }
}
```

### Hide Code Element Visually

```json
{
  "settings": {
    "executeCode": true,
    "_cssCustom": "#brxe-cod001 {\n  display: none;\n}",
    "javascriptCode": "// Your JS code here"
  }
}
```

---

## Template Element

Insert another Bricks template.

```json
{
  "id": "tpl001",
  "name": "template",
  "parent": "con001",
  "children": [],
  "settings": {
    "template": 123
  }
}
```

---

## Query Loop

Dynamic content loop.

```json
{
  "id": "loop01",
  "name": "block",
  "parent": "con001",
  "children": ["crd001"],
  "settings": {
    "hasLoop": true,
    "query": {
      "post_type": ["post"],
      "posts_per_page": "9",
      "orderby": ["date"],
      "order": ["desc"],
      "tax_query": [
        {
          "taxonomy": "category",
          "terms": [1, 2, 3]
        }
      ]
    },
    "_display": "grid",
    "_gridTemplateColumns": "repeat(3, 1fr)",
    "_gridGap": "var(--grid-gap)"
  },
  "label": "Posts Grid"
}
```

### Query Parameters

| Parameter | Description |
|-----------|-------------|
| `post_type` | Post type(s) to query |
| `posts_per_page` | Number of posts |
| `orderby` | Sort field |
| `order` | Sort direction (asc/desc) |
| `tax_query` | Taxonomy filtering |
| `meta_query` | Custom field filtering |
| `offset` | Skip first N posts |

---

## Advanced Best Practices

### Performance

1. Limit slider items (3-10 recommended)
2. Use appropriate image sizes
3. Lazy load off-screen content
4. Minimize custom JavaScript

### Accessibility

1. Ensure keyboard navigation works
2. Add ARIA labels to sliders
3. Provide pause controls for auto-playing content
4. Maintain focus visibility

### Responsive

1. Reduce perPage on smaller screens
2. Consider hiding arrows on touch devices
3. Adjust gap spacing for mobile
4. Test touch swipe behavior
