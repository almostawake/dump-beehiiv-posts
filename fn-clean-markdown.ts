/**
 * Clean up markdown content by removing HTML/CSS styling
 * @param markdown The markdown content to clean
 */
export function cleanMarkdown(markdown: string): string {
  // Remove CSS style blocks
  let cleaned = markdown.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove CSS classes and inline styles
  cleaned = cleaned.replace(/\s+class="[^"]*"/gi, '');
  cleaned = cleaned.replace(/\s+style="[^"]*"/gi, '');
  
  // Extract actual content from HTML
  // First, simplify paragraphs and headers
  cleaned = cleaned.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');
  cleaned = cleaned.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n');
  cleaned = cleaned.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n');
  cleaned = cleaned.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n');
  cleaned = cleaned.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '#### $1\n\n');
  cleaned = cleaned.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '##### $1\n\n');
  cleaned = cleaned.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '###### $1\n\n');
  
  // Handle lists
  cleaned = cleaned.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, '$1\n\n');
  cleaned = cleaned.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, '$1\n\n');
  cleaned = cleaned.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
  
  // Handle line breaks
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
  
  // Handle bold and italic
  cleaned = cleaned.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  cleaned = cleaned.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  cleaned = cleaned.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');
  cleaned = cleaned.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  
  // Handle links
  cleaned = cleaned.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');
  
  // Handle images
  cleaned = cleaned.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
  cleaned = cleaned.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)');
  
  // Remove remaining HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Remove remaining HTML comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove variable placeholders and tracking pixels
  cleaned = cleaned.replace(/{{[^}]*}}/g, '');
  
  // Remove empty lines and excessive whitespace
  cleaned = cleaned.replace(/^\s*[\r\n]/gm, '\n');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Fix common HTML entities
  cleaned = cleaned.replace(/&nbsp;/g, ' ');
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&apos;/g, "'");
  cleaned = cleaned.replace(/&mdash;/g, '—');
  cleaned = cleaned.replace(/&ndash;/g, '–');
  
  return cleaned.trim();
}