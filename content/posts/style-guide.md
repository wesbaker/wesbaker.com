---
title: "Style Guide"
date: 2026-05-08T00:00:00-04:00
draft: true
extra:
  subtitle: "A reference page showing all available markdown styles"
taxonomies:
  tags:
    - style
    - design
    - markdown
---

## Subtitle

This page uses the optional `subtitle` frontmatter field:

```yaml
extra:
  subtitle: "A reference page showing all available markdown styles"
```

It renders in a `<p class="page-subtitle">` inside an `<hgroup>` with the `<h1>`, using `--text-2` (muted) and `font-size: 1.1rem`.

## Headings

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

## Text

Regular paragraph text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

**Bold text** and *italic text* and ***bold italic text***. You can also use ~~strikethrough~~ and `inline code` within a sentence.

## Lists

### Unordered List

- First item
- Second item
  - Nested item
  - Another nested item
    - Deeply nested item
- Third item

### Ordered List

1. First item
2. Second item
   1. Nested ordered item
   2. Another nested ordered item
3. Third item

### Mixed Lists

1. First ordered item
   - Nested unordered
   - Another nested unordered
2. Second ordered item

## Blockquote

> This is a blockquote. It can span multiple lines and contain **bold**, *italic*, and `inline code`.
>
> It can also have multiple paragraphs.

> Nested blockquotes:
>
> > This is nested inside the first blockquote.

## Code

### Inline Code

Use `zola serve` to start the development server, or `zola build` for a production build.

### Code Block (no language)

```
This is a plain code block
with no syntax highlighting.
```

### Code Block (JavaScript)

```javascript
function greet(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
  return message;
}

greet('World');
```

### Code Block (TypeScript)

```typescript
interface Post {
  title: string;
  date: Date;
  tags: string[];
  draft?: boolean;
}

const post: Post = {
  title: 'Style Guide',
  date: new Date(),
  tags: [],
};
```

### Code Block (Shell)

```bash
zola build
zola check --skip-external-links
git submodule update --init --recursive
```

## Table

| Column One | Column Two | Column Three |
|------------|------------|--------------|
| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |
| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |
| Row 3, Col 1 | Row 3, Col 2 | Row 3, Col 3 |

### Aligned Table

| Left-aligned | Center-aligned | Right-aligned |
|:-------------|:--------------:|--------------:|
| Left | Center | Right |
| Text | Text | Text |
| More text | More text | More text |

## Links

[External link](https://www.getzola.org) — opens in the same tab.

[Link with title](https://www.getzola.org "Zola — a fast static site generator")

## Horizontal Rule

Below this paragraph is a horizontal rule.

---

## Emphasis Combinations

- **Bold**
- *Italic*
- ***Bold and italic***
- ~~Strikethrough~~
- `Inline code`
- **`Bold inline code`**
- *`Italic inline code`*

## Definition / Description List (HTML)

<dl>
  <dt>Zola</dt>
  <dd>A fast static site generator written in Rust.</dd>
  <dt>Tera</dt>
  <dd>The templating engine used by Zola, inspired by Jinja2.</dd>
</dl>

## Task List

- [x] Completed item
- [ ] Incomplete item
- [x] Another completed item

## Footnotes

Here is a sentence with a footnote.[^1]

[^1]: This is the footnote content.

## Long Paragraph

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui.
