import { htmlToMarkdown } from './fn-html-to-markdown.js';
import fs from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';

// Directories
const POSTS_DIR = 'posts';
const MARKDOWN_DIR = 'markdown-html';

interface BeehiivPost {
  data: {
    id: string;
    title: string;
    slug: string;
    web_url?: string;
    content?: {
      email?: string;
      premium_email?: string;
      premium?: {
        email?: string;
      };
    };
  };
}

/**
 * Preprocess HTML content to remove unwanted elements
 * @param htmlContent The HTML content to preprocess
 */
function preprocessHtml(htmlContent: string): string {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  
  // List of text strings to look for and remove their containing elements
  const textsToRemove = [
    'Read Online',
    'Andrew Walker',
    'OPEN_TRACKING_PIXEL',
    'Did someone forward this email to you?',
    'Back issues available',
    '228 Park Ave'
  ];
  
  textsToRemove.forEach(text => {
    // Find all text nodes containing the target text
    const walker = document.createTreeWalker(
      document.body,
      dom.window.NodeFilter.SHOW_TEXT
    );
    
    const nodesToRemove: Element[] = [];
    let node: Node | null;
    
    while (node = walker.nextNode()) {
      if (node.textContent && node.textContent.includes(text)) {
        // Find the appropriate container element to remove
        let elementToRemove: Element | null = null;
        
        // For "228 Park Ave", remove the entire table
        if (text === '228 Park Ave') {
          elementToRemove = node.parentElement;
          while (elementToRemove && elementToRemove.tagName !== 'TABLE') {
            elementToRemove = elementToRemove.parentElement;
          }
        } else {
          // For other texts, remove the tr element
          elementToRemove = node.parentElement;
          while (elementToRemove && elementToRemove.tagName !== 'TR') {
            elementToRemove = elementToRemove.parentElement;
          }
        }
        
        if (elementToRemove) {
          nodesToRemove.push(elementToRemove);
        }
      }
    }
    
    // Remove all found elements
    nodesToRemove.forEach(element => {
      element.remove();
    });
  });
  
  // Clean up headings to remove all formatting
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    // Get just the text content, which removes all inner HTML formatting
    const plainText = heading.textContent || '';
    // Clear the heading and set it to plain text only
    heading.innerHTML = plainText.trim();
  });
  
  return document.body.innerHTML;
}

/**
 * Clean up markdown content by removing HTML/CSS styling
 * @param markdown The markdown content to clean
 */
function cleanMarkdown(markdown: string): string {
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

/**
 * Convert a post's HTML content to Markdown and also save the raw HTML
 * @param postFile JSON file containing post data
 */
async function convertPostToMarkdown(postFile: string): Promise<void> {
  try {
    // Read post JSON file
    const postPath = path.join(POSTS_DIR, postFile);
    const postContent = await fs.readFile(postPath, 'utf-8');
    const post = JSON.parse(postContent) as BeehiivPost;
    
    // Get HTML content 
    let htmlContent = '';
    
    // Try to extract HTML from the different possible locations
    if (post.data.content && typeof post.data.content === 'object') {
      // It's in the content object structure
      if (post.data.content.premium?.email) {
        htmlContent = post.data.content.premium.email;
      } else if (post.data.content.premium_email) {
        htmlContent = post.data.content.premium_email;
      } else if (post.data.content.email) {
        htmlContent = post.data.content.email;
      }
    } else if (typeof post.data.content === 'string') {
      // Content is directly a string
      htmlContent = post.data.content;
    }
    
    if (!htmlContent) {
      console.log(`No HTML content found for post: ${postFile}`);
      return;
    }
    
    // Preprocess HTML to remove unwanted content
    htmlContent = preprocessHtml(htmlContent);
    
    // Save the preprocessed HTML content
    const baseFileName = post.data.slug;
    const htmlFileName = `${baseFileName}.html`;
    const htmlPath = path.join(MARKDOWN_DIR, htmlFileName);
    
    // Get the URL for the markdown file
    const webUrl = post.data.web_url || '';
    
    // Save the preprocessed HTML content
    await fs.writeFile(htmlPath, htmlContent, 'utf-8');
    console.log(`Saved preprocessed HTML: ${htmlFileName}`);
    
    // Clean up the HTML content before conversion
    // Remove the <style> tags and CSS
    htmlContent = htmlContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // Convert HTML to Markdown
    let markdown = htmlToMarkdown(htmlContent);
    
    // Clean up the resulting markdown
    markdown = cleanMarkdown(markdown);
    
    // Prepare final markdown with URL at top
    const finalMarkdown = `Article URL: ${webUrl}\n\n${markdown}`;
    
    // Save markdown to file
    const markdownFileName = `${baseFileName}.md`;
    const markdownPath = path.join(MARKDOWN_DIR, markdownFileName);
    
    await fs.writeFile(markdownPath, finalMarkdown, 'utf-8');
    console.log(`Converted to markdown: ${markdownFileName}`);
  } catch (error) {
    console.error(`Error processing post ${postFile}:`, error);
  }
}

/**
 * Main function to process all posts
 */
async function main() {
  try {
    // Clear existing markdown directory
    await fs.rm(MARKDOWN_DIR, { recursive: true, force: true });
    await fs.mkdir(MARKDOWN_DIR, { recursive: true });
    
    console.log(`Cleared and recreated markdown directory: ${MARKDOWN_DIR}`);
    
    // Get all post files
    const files = await fs.readdir(POSTS_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log(`Found ${jsonFiles.length} posts to process`);
    
    // Process each post
    for (let i = 0; i < jsonFiles.length; i++) {
      const file = jsonFiles[i];
      console.log(`Processing post ${i + 1}/${jsonFiles.length}: ${file}`);
      await convertPostToMarkdown(file);
    }
    
    console.log(`\nCompleted processing ${jsonFiles.length} posts.`);
    console.log(`Markdown files have been saved to the '${MARKDOWN_DIR}' directory.`);
  } catch (error) {
    console.error('Error processing posts:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);