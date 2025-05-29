import { convertPostToMarkdown } from './fn-convert-post-to-markdown.js';
import fs from 'fs/promises';

// Directories
const POSTS_DIR = 'posts';
const MARKDOWN_DIR = 'markdown-html';


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
      await convertPostToMarkdown(file, POSTS_DIR, MARKDOWN_DIR);
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