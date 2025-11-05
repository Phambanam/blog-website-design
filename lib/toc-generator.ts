/**
 * Table of Contents Generator
 * Extracts headings from markdown content and generates a structured TOC
 */

export interface TocItem {
  id: string;
  text: string;
  level: number; // 1-6 for h1-h6
}

/**
 * Generate table of contents from markdown content
 * @param content - Markdown content
 * @returns Array of TOC items
 */
export function generateTableOfContents(content: string): TocItem[] {
  const toc: TocItem[] = [];

  // Match markdown headings (# Heading)
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; // Number of # symbols
    const text = match[2].trim();

    // Generate ID from heading text (slugify)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-') // Replace multiple dashes with single
      .trim();

    toc.push({
      id,
      text,
      level,
    });
  }

  return toc;
}

/**
 * Inject IDs into markdown headings for anchor links
 * @param content - Markdown content
 * @returns Content with IDs added to headings
 */
export function injectHeadingIds(content: string): string {
  return content.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
    const cleanText = text.trim();
    const id = cleanText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    return `${hashes} ${cleanText} {#${id}}`;
  });
}

/**
 * Convert TOC to HTML for display
 * @param toc - Array of TOC items
 * @returns HTML string
 */
export function tocToHtml(toc: TocItem[]): string {
  if (toc.length === 0) return '';

  let html = '<nav class="table-of-contents"><ul>';
  let currentLevel = 0;

  toc.forEach((item, index) => {
    if (item.level > currentLevel) {
      // Open nested list
      for (let i = currentLevel; i < item.level; i++) {
        html += '<ul>';
      }
    } else if (item.level < currentLevel) {
      // Close nested list
      for (let i = item.level; i < currentLevel; i++) {
        html += '</ul></li>';
      }
    } else if (index > 0) {
      html += '</li>';
    }

    html += `<li><a href="#${item.id}">${item.text}</a>`;
    currentLevel = item.level;
  });

  // Close remaining tags
  for (let i = 0; i < currentLevel; i++) {
    html += '</li></ul>';
  }

  html += '</nav>';
  return html;
}
