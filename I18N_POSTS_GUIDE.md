# Multilingual Blog Posts & Table of Contents Guide

## Overview

The blog now supports:
1. **Multilingual content** - Write posts in multiple languages (English & Vietnamese)
2. **Automatic Table of Contents** - Generated from markdown headings
3. **Locale-specific display** - Posts show in user's selected language

## Database Schema

### Tables

#### `posts` (Main post metadata)
```sql
- id: UUID (primary key)
- author_id: UUID (references users)
- featured_image: TEXT
- status: TEXT ('draft' | 'published')
- read_time: INT
- table_of_contents: JSONB (auto-generated)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `post_translations` (Language-specific content)
```sql
- id: UUID (primary key)
- post_id: UUID (references posts)
- locale: VARCHAR(5) ('en' | 'vi')
- title: TEXT
- excerpt: TEXT
- content: TEXT (markdown)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- UNIQUE(post_id, locale)
```

## API Endpoints

### Get Posts (with translation)
```
GET /api/posts?status=published&locale=en
```

Response includes translated content if available, falls back to original.

### Get Single Post (with translation)
```
GET /api/posts/[id]?locale=en
```

### Manage Translations

#### Get all translations for a post
```
GET /api/posts/[id]/translations
```

#### Create/Update translation
```
POST /api/posts/[id]/translations
Content-Type: application/json

{
  "locale": "vi",
  "title": "Tiêu đề bài viết",
  "excerpt": "Tóm tắt",
  "content": "# Nội dung bài viết\n\n## Mục 1\n..."
}
```

#### Delete translation
```
DELETE /api/posts/[id]/translations?locale=vi
```

## Table of Contents

### How it works

1. **Auto-generation**: When saving a translation, TOC is automatically generated from markdown headings (`# H1`, `## H2`, etc.)

2. **Storage**: TOC is stored as JSON in `posts.table_of_contents`:
```json
[
  { "id": "introduction", "text": "Introduction", "level": 1 },
  { "id": "getting-started", "text": "Getting Started", "level": 2 },
  { "id": "prerequisites", "text": "Prerequisites", "level": 3 }
]
```

3. **Display**: The `TableOfContents` component renders an interactive sidebar with:
   - Smooth scrolling
   - Active section highlighting
   - Nested structure based on heading levels

### Markdown heading format

```markdown
# Main Heading (H1)
## Section Heading (H2)
### Subsection (H3)
#### Detail (H4)
```

The TOC generator:
- Extracts headings (H1-H6)
- Creates URL-safe IDs (slugified)
- Preserves hierarchy

## Writing Posts in Multiple Languages

### Step 1: Create the post
```javascript
POST /api/posts
{
  "title": "Default title (optional)",
  "content": "Default content (optional)",
  "featured_image": "url",
  "tags": ["tag1", "tag2"]
}
```

### Step 2: Add translations
```javascript
// English version
POST /api/posts/[id]/translations
{
  "locale": "en",
  "title": "My Blog Post",
  "excerpt": "A brief summary",
  "content": "# Introduction\n\n## Main Content\n..."
}

// Vietnamese version
POST /api/posts/[id]/translations
{
  "locale": "vi",
  "title": "Bài viết của tôi",
  "excerpt": "Tóm tắt ngắn gọn",
  "content": "# Giới thiệu\n\n## Nội dung chính\n..."
}
```

## Frontend Integration

### Fetching posts with locale

```typescript
// In blog-context or component
const locale = useLocale(); // from next-intl

const response = await fetch(`/api/posts?status=published&locale=${locale}`);
const posts = await response.json();
```

### Displaying Table of Contents

```tsx
import TableOfContents from "@/components/blog/table-of-contents"

// In post display component
<div className="flex gap-8">
  {/* Main content */}
  <article className="flex-1">
    <div dangerouslySetInnerHTML={{ __html: post.content }} />
  </article>

  {/* TOC Sidebar */}
  <aside className="w-64 sticky top-20 h-fit">
    <TableOfContents items={post.table_of_contents || []} />
  </aside>
</div>
```

### Markdown to HTML with heading IDs

For proper TOC linking, ensure headings have IDs in the rendered HTML:

```typescript
import { injectHeadingIds } from "@/lib/toc-generator"
import { marked } from "marked" // or your markdown parser

const contentWithIds = injectHeadingIds(post.content)
const html = marked(contentWithIds)
```

## Admin UI Considerations

### Multi-language editor (To be implemented)

The admin post editor should:

1. **Language selector tabs**
   - Switch between EN / VI
   - Show which translations exist
   - Highlight missing translations

2. **Side-by-side editing (optional)**
   - Edit both languages simultaneously
   - Sync scrolling

3. **Translation status indicator**
   - ✅ EN: Complete
   - ⚠️ VI: Missing or outdated

### Example UI mockup

```
┌─────────────────────────────────────────┐
│  Post Editor                            │
├─────────────────────────────────────────┤
│  [ EN ✓ ]  [ VI ⚠️ ]   < Language tabs  │
├─────────────────────────────────────────┤
│  Title: ____________________________    │
│  Excerpt: _________________________    │
│  Content:                              │
│  ┌───────────────────────────────────┐ │
│  │ # My Heading                      │ │
│  │                                   │ │
│  │ ## Subheading                     │ │
│  │ Content here...                   │ │
│  └───────────────────────────────────┘ │
│                                        │
│  [ Preview TOC ]  [ Save EN ]         │
└─────────────────────────────────────────┘
```

## Best Practices

### 1. Content Structure
- Use clear, hierarchical headings
- Keep heading text concise for TOC
- Avoid special characters in headings

### 2. Translation Workflow
- Write content in primary language first
- Review TOC before translating
- Maintain similar structure across languages

### 3. SEO Considerations
- Each locale can have different title/excerpt
- Use locale in meta tags
- Consider lang-specific slugs (future feature)

### 4. Performance
- TOC is pre-generated on save (not runtime)
- Translations are JOINed efficiently
- Add caching for published posts (future)

## Migration Notes

### Existing posts
Posts created before this feature:
- Will have empty `table_of_contents`
- Can add translations via API
- Will fallback to main title/content if no translation

### Database migration
Run the migration script:
```bash
docker exec -i blog_postgres psql -U blog_user -d blog_db < scripts/init-db/002_add_translations.sql
```

## Future Enhancements

- [ ] Admin UI for translation management
- [ ] Translation status dashboard
- [ ] Automatic translation suggestions (AI)
- [ ] Version history for translations
- [ ] Markdown preview with TOC
- [ ] Copy from one language to another
- [ ] Translation completeness percentage
- [ ] SEO-friendly URLs per language
- [ ] Support for more languages

## Example Usage

### Complete example: Creating a bilingual post

```typescript
// 1. Create base post
const createResponse = await fetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    featured_image: '/images/post.jpg',
    tags: ['tutorial', 'nextjs']
  })
});
const { id } = await createResponse.json();

// 2. Add English content
await fetch(`/api/posts/${id}/translations`, {
  method: 'POST',
  body: JSON.stringify({
    locale: 'en',
    title: 'Getting Started with Next.js',
    excerpt: 'Learn how to build modern web apps',
    content: `# Introduction

## What is Next.js?

Next.js is a React framework...

## Getting Started

### Installation

\`\`\`bash
npx create-next-app
\`\`\`
`
  })
});

// 3. Add Vietnamese content
await fetch(`/api/posts/${id}/translations`, {
  method: 'POST',
  body: JSON.stringify({
    locale: 'vi',
    title: 'Bắt đầu với Next.js',
    excerpt: 'Học cách xây dựng ứng dụng web hiện đại',
    content: `# Giới thiệu

## Next.js là gì?

Next.js là một framework React...

## Bắt đầu

### Cài đặt

\`\`\`bash
npx create-next-app
\`\`\`
`
  })
});

// 4. Publish
await fetch(`/api/posts/${id}`, {
  method: 'PUT',
  body: JSON.stringify({ status: 'published' })
});
```

---

**Last Updated**: 2025-10-22
**Status**: ✅ Backend Complete, 🔄 Admin UI Pending
