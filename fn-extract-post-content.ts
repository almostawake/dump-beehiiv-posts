import fs from 'fs/promises';
import path from 'path';
import { fileHtmlToMarkdown } from './fn-html-to-markdown.js';
import { BeehiivPost } from './types.js';

const POSTS_DIR = 'posts';
const MARKDOWN_DIR = 'markdown';

/**
 * Extracts HTML content from a post and converts it to Markdown
 * @param postSlug The slug of the post to process
 */
async function extractPostContent(postSlug: string): Promise<void> {
  try {
    // Ensure markdown directory exists
    await fs.mkdir(MARKDOWN_DIR, { recursive: true });
    
    // Read the post JSON file
    const postPath = path.join(POSTS_DIR, `${postSlug}.json`);
    const postContent = await fs.readFile(postPath, 'utf-8');
    const post = JSON.parse(postContent) as BeehiivPost;
    
    // Extract the HTML content (web_content if available, otherwise content)
    const htmlContent = post.web_content || post.content || '';
    
    if (!htmlContent) {
      console.error(`No content found for post: ${postSlug}`);
      return;
    }
    
    // Convert HTML to Markdown
    const markdown = await htmlToMarkdown(htmlContent);
    
    // Add post metadata at the top
    const metadataMarkdown = generateMetadata(post);
    const fullMarkdown = `${metadataMarkdown}\n\n${markdown}`;
    
    // Save to markdown file
    const markdownPath = path.join(MARKDOWN_DIR, `${postSlug}.md`);
    await fs.writeFile(markdownPath, fullMarkdown, 'utf-8');
    
    console.log(`Markdown saved for post: ${postSlug}`);
  } catch (error) {
    console.error(`Error extracting content for post ${postSlug}:`, error);
  }
}

/**
 * Converts HTML to Markdown
 * @param html HTML content
 * @returns Markdown content
 */
async function htmlToMarkdown(html: string): Promise<string> {
  // Create a temporary HTML file
  const tempHtmlPath = path.join(process.cwd(), 'temp.html');
  await fs.writeFile(tempHtmlPath, html, 'utf-8');
  
  try {
    // Convert to Markdown
    const markdown = await fileHtmlToMarkdown(tempHtmlPath);
    return markdown;
  } finally {
    // Clean up temporary file
    try {
      await fs.unlink(tempHtmlPath);
    } catch (error) {
      console.error('Error removing temporary HTML file:', error);
    }
  }
}

/**
 * Generates metadata markdown for a post
 * @param post The post to generate metadata for
 * @returns Markdown string with metadata
 */
function generateMetadata(post: BeehiivPost): string {
  const publishDate = post.publish_date 
    ? new Date(parseInt(post.publish_date) * 1000).toISOString().split('T')[0]
    : 'Unpublished';
  
  const authors = Array.isArray(post.authors) 
    ? post.authors.join(', ') 
    : (post.authors || 'Unknown');
  
  return `---
title: "${post.title}"
slug: "${post.slug}"
date: "${publishDate}"
author: "${authors}"
status: "${post.status}"
---`;
}

/**
 * Processes all posts in the posts directory
 */
async function processAllPosts(): Promise<void> {
  try {
    // Get all post files
    const files = await fs.readdir(POSTS_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log(`Found ${jsonFiles.length} posts to process`);
    
    // Process each post
    for (let i = 0; i < jsonFiles.length; i++) {
      const file = jsonFiles[i];
      const slug = file.replace('.json', '');
      
      console.log(`Processing post ${i + 1}/${jsonFiles.length}: ${slug}`);
      await extractPostContent(slug);
    }
    
    console.log(`\nCompleted processing ${jsonFiles.length} posts.`);
    console.log(`Markdown files have been saved to the '${MARKDOWN_DIR}' directory.`);
  } catch (error) {
    console.error('Error processing posts:', error);
  }
}

// Main execution
processAllPosts().catch(console.error);