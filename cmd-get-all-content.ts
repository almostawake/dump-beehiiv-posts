import { getAllPosts, enrichPostsWithContent } from './fn-posts.js';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  try {
    // Step 1: Get all posts from the API
    const posts = await getAllPosts();
    
    if (posts.length === 0) {
      console.log('No posts found.');
      return;
    }
    
    // Step 2: Enrich each post with detailed content and save to files
    console.log(`\nEnriching ${posts.length} posts with detailed content...`);
    
    const enrichedPosts = await enrichPostsWithContent(posts);
    
    console.log(`\nCompleted processing ${enrichedPosts.length} posts.`);
    console.log(`All posts have been saved to the 'posts' directory.`);
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

main().catch(console.error);