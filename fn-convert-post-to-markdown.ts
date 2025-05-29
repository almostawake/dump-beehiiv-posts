import { htmlToMarkdown } from './fn-html-to-markdown.js';
import { preprocessHtml } from './fn-preprocess-html.js';
import { cleanMarkdown } from './fn-clean-markdown.js';
import fs from 'fs/promises';
import path from 'path';

interface BeehiivPost {
  data: {
    id: string;
    title: string;
    slug: string;
    web_url?: string;
    publish_date?: number;
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
 * Convert a post's HTML content to Markdown and also save the raw HTML
 * @param postFile JSON file containing post data
 * @param postsDir Directory containing posts JSON files
 * @param markdownDir Directory to save markdown and HTML files
 */
export async function convertPostToMarkdown(postFile: string, postsDir: string, markdownDir: string): Promise<void> {
  try {
    // Read post JSON file
    const postPath = path.join(postsDir, postFile);
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
    const htmlPath = path.join(markdownDir, htmlFileName);
    
    // Get the URL for the markdown file
    const webUrl = post.data.web_url || '';
    
    // Get and format the publish date
    const publishDate = post.data.publish_date ? new Date(post.data.publish_date * 1000).toISOString().split('T')[0] : '';
    
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
    
    // Prepare final markdown with date and URL at top
    let finalMarkdown = '';
    if (publishDate) {
      finalMarkdown += `Date Published: ${publishDate}\n\n`;
    }
    finalMarkdown += `Article URL: ${webUrl}\n\n${markdown}`;
    
    // Save markdown to file
    const markdownFileName = `${baseFileName}.md`;
    const markdownPath = path.join(markdownDir, markdownFileName);
    
    await fs.writeFile(markdownPath, finalMarkdown, 'utf-8');
    console.log(`Converted to markdown: ${markdownFileName}`);
  } catch (error) {
    console.error(`Error processing post ${postFile}:`, error);
  }
}