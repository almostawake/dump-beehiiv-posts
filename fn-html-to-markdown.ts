import TurndownService from 'turndown';
import fs from 'fs/promises';

/**
 * Converts HTML content to Markdown
 * @param html HTML content as string
 * @param options Optional turndown configuration options
 * @returns Markdown content as string
 */
export function htmlToMarkdown(html: string, options: any = {}): string {
  // Set up the turndown service with default options
  const defaultOptions = {
    headingStyle: 'atx',         // Use # style headings
    hr: '---',                   // Horizontal rules use ---
    bulletListMarker: '-',       // Use - for bullet points
    codeBlockStyle: 'fenced',    // Use ``` for code blocks
    fence: '```',                // Fence character
    emDelimiter: '*',            // Use * for emphasis
    strongDelimiter: '**',       // Use ** for strong emphasis
    linkStyle: 'inlined',        // Use inline links
  };

  // Merge default options with any provided options
  const turndownOptions = { ...defaultOptions, ...options };
  
  // Create the turndown service
  const turndownService = new TurndownService(turndownOptions);
  
  // Add custom rules
  
  // Rule to handle images with proper alt text
  turndownService.addRule('images', {
    filter: 'img',
    replacement: function (content, node) {
      const alt = node.getAttribute('alt') || '';
      const src = node.getAttribute('src') || '';
      const title = node.getAttribute('title') || '';
      
      return title
        ? `![${alt}](${src} "${title}")`
        : `![${alt}](${src})`;
    }
  });
  
  // Rule to improve handling of links
  turndownService.addRule('links', {
    filter: function (node) {
      return node.nodeName === 'A' && node.getAttribute('href');
    },
    replacement: function (content, node) {
      const href = node.getAttribute('href') || '';
      const title = node.getAttribute('title') || '';
      
      return title
        ? `[${content}](${href} "${title}")`
        : `[${content}](${href})`;
    }
  });
  
  // Keep certain HTML elements that don't have good Markdown equivalents
  turndownService.keep(['iframe', 'video', 'audio', 'figure', 'table']);
  
  // Convert the HTML to Markdown
  return turndownService.turndown(html);
}

/**
 * Reads an HTML file and converts it to Markdown
 * @param htmlFilePath Path to the HTML file
 * @param options Optional turndown configuration options
 * @returns Markdown content as string
 */
export async function fileHtmlToMarkdown(htmlFilePath: string, options: any = {}): Promise<string> {
  try {
    // Read the HTML file
    const html = await fs.readFile(htmlFilePath, 'utf-8');
    
    // Convert to Markdown
    return htmlToMarkdown(html, options);
  } catch (error) {
    console.error(`Error converting HTML file to Markdown: ${error}`);
    throw error;
  }
}