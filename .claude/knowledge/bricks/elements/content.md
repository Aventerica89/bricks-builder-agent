# Content Elements

Text, images, and media elements for page content.

## Heading

Heading elements for h1-h6 tags.

```json
{
  "id": "hdg001",
  "name": "heading",
  "parent": "con001",
  "children": [],
  "settings": {
    "text": "Welcome to Our Site",
    "tag": "h1",
    "_typography": {
      "font-size": "var(--h1)",
      "font-weight": "700",
      "color": { "raw": "var(--base)" },
      "line-height": "1.2"
    }
  }
}
```

### Heading Tags

| Tag | Use Case |
|-----|----------|
| `h1` | Page title (one per page) |
| `h2` | Section headings |
| `h3` | Subsection headings, card titles |
| `h4` | Small headings |
| `h5` | Eyebrow text, labels |
| `h6` | Smallest heading |

### Dynamic Heading

```json
{
  "settings": {
    "text": "{post_title}",
    "tag": "h1"
  }
}
```

### Heading with Link

```json
{
  "settings": {
    "text": "Learn More",
    "tag": "h3",
    "link": {
      "type": "external",
      "url": "/services"
    }
  }
}
```

---

## Text Basic

Single-line or simple text element.

```json
{
  "id": "txt001",
  "name": "text-basic",
  "parent": "con001",
  "children": [],
  "settings": {
    "text": "Discover amazing things with our services.",
    "_typography": {
      "font-size": "var(--text-l)",
      "color": { "raw": "var(--base-light)" },
      "line-height": "1.6"
    }
  },
  "label": "Subheading"
}
```

### Text with Link

```json
{
  "settings": {
    "text": "Read more about us",
    "link": {
      "type": "external",
      "url": "/about"
    }
  }
}
```

### Dynamic Text

```json
{
  "settings": {
    "text": "{post_excerpt}"
  }
}
```

---

## Rich Text

Multi-paragraph text with HTML formatting.

```json
{
  "id": "rtx001",
  "name": "rich-text",
  "parent": "con001",
  "children": [],
  "settings": {
    "text": "<p>First paragraph of content.</p>\n<p>Second paragraph with <strong>bold</strong> and <em>italic</em> text.</p>\n<ul>\n<li>List item one</li>\n<li>List item two</li>\n</ul>",
    "_typography": {
      "font-size": "var(--text-m)",
      "color": { "raw": "var(--base)" },
      "line-height": "1.7"
    }
  }
}
```

### Rich Text for Blog Content

```json
{
  "settings": {
    "text": "{post_content}",
    "_typography": {
      "font-size": "var(--text-m)",
      "line-height": "1.8"
    },
    "_cssCustom": "#brxe-rtx001 p {\n  margin-bottom: var(--space-m);\n}\n\n#brxe-rtx001 h2 {\n  margin-top: var(--space-xl);\n  margin-bottom: var(--space-m);\n}"
  }
}
```

---

## Image

Single image element.

```json
{
  "id": "img001",
  "name": "image",
  "parent": "blk001",
  "children": [],
  "settings": {
    "image": {
      "id": 123,
      "url": "https://example.com/image.jpg",
      "filename": "image.jpg",
      "size": "large"
    },
    "_width": "100%",
    "_height": "auto",
    "_objectFit": "cover"
  }
}
```

### Image Sizes

| Size | Description |
|------|-------------|
| `thumbnail` | Small thumbnail |
| `medium` | Medium size |
| `large` | Large size |
| `full` | Full original size |

### Dynamic Image (Featured Image)

```json
{
  "settings": {
    "image": {
      "useDynamicData": "{featured_image}",
      "size": "large"
    }
  }
}
```

### Dynamic Image (ACF Field)

```json
{
  "settings": {
    "image": {
      "useDynamicData": "{acf_hero_image}",
      "size": "full"
    }
  }
}
```

### Image with Aspect Ratio

```json
{
  "settings": {
    "image": { "url": "...", "size": "large" },
    "_width": "100%",
    "_objectFit": "cover",
    "_cssCustom": "#brxe-img001 {\n  aspect-ratio: 16/9;\n}"
  }
}
```

### Rounded Image

```json
{
  "settings": {
    "image": { "url": "...", "size": "large" },
    "_border": {
      "radius": {
        "top": "var(--radius)",
        "right": "var(--radius)",
        "bottom": "var(--radius)",
        "left": "var(--radius)"
      }
    },
    "_overflow": "hidden"
  }
}
```

### Circular Image (Avatar)

```json
{
  "settings": {
    "image": { "url": "...", "size": "medium" },
    "_width": "80px",
    "_height": "80px",
    "_objectFit": "cover",
    "_border": {
      "radius": {
        "top": "50%",
        "right": "50%",
        "bottom": "50%",
        "left": "50%"
      }
    }
  }
}
```

---

## Video

Video element for embedded or self-hosted videos.

```json
{
  "id": "vid001",
  "name": "video",
  "parent": "blk001",
  "children": [],
  "settings": {
    "videoType": "youtube",
    "videoId": "dQw4w9WgXcQ",
    "_width": "100%",
    "_cssCustom": "#brxe-vid001 {\n  aspect-ratio: 16/9;\n}"
  }
}
```

### Video Types

| Type | Setting |
|------|---------|
| YouTube | `"videoType": "youtube", "videoId": "ID"` |
| Vimeo | `"videoType": "vimeo", "videoId": "ID"` |
| Self-hosted | `"videoType": "file", "videoUrl": "URL"` |

### Self-Hosted Video

```json
{
  "settings": {
    "videoType": "file",
    "videoUrl": "https://example.com/video.mp4",
    "autoplay": true,
    "loop": true,
    "muted": true,
    "controls": false
  }
}
```

---

## Icon

Icon element supporting multiple icon libraries.

```json
{
  "id": "ico001",
  "name": "icon",
  "parent": "div001",
  "children": [],
  "settings": {
    "icon": {
      "library": "fontawesome",
      "icon": "fas fa-check"
    },
    "iconSize": "24",
    "iconColor": { "raw": "var(--primary)" }
  }
}
```

### Icon Libraries

| Library | Example |
|---------|---------|
| FontAwesome | `"library": "fontawesome", "icon": "fas fa-star"` |
| Ionicons | `"library": "ionicons", "icon": "ion-md-pin"` |
| Themify | `"library": "themify", "icon": "ti-angle-right"` |

### Icon with Background

```json
{
  "settings": {
    "icon": { "library": "fontawesome", "icon": "fas fa-check" },
    "iconSize": "20",
    "iconColor": { "raw": "var(--white)" },
    "_background": { "color": { "raw": "var(--primary)" } },
    "_width": "48px",
    "_height": "48px",
    "_display": "flex",
    "_justifyContent": "center",
    "_alignItems": "center",
    "_border": {
      "radius": { "top": "50%", "right": "50%", "bottom": "50%", "left": "50%" }
    }
  }
}
```

---

## Logo

Logo image element, typically used in headers.

```json
{
  "id": "logo01",
  "name": "logo",
  "parent": "con001",
  "children": [],
  "settings": {
    "logo": {
      "id": 456,
      "url": "https://example.com/logo.svg"
    },
    "_height": "50px",
    "_width": "auto"
  }
}
```

### Logo with Link to Home

```json
{
  "settings": {
    "logo": { "url": "..." },
    "link": {
      "type": "internal",
      "url": "/"
    },
    "_height": "40px",
    "_height:mobile_portrait": "32px"
  }
}
```

---

## Content Element Best Practices

### Typography Hierarchy

```
h1 - Page title (var(--h1), 700 weight)
  h2 - Section title (var(--h2), 700 weight)
    h3 - Card/subsection title (var(--h3), 600 weight)
      text-l - Intro paragraph
      text-m - Body text
      text-s - Caption/small text
```

### Image Optimization

1. Use appropriate `size` (don't load full for thumbnails)
2. Set `_objectFit: cover` for consistent sizing
3. Use aspect ratio for predictable layouts
4. Add border radius for modern look

### Dynamic Content

- Use `{post_title}`, `{post_excerpt}`, `{post_content}` for posts
- Use `{featured_image}` for post images
- Use `{acf_field_name}` for ACF fields
- Use `{site_title}`, `{site_tagline}` for site info
