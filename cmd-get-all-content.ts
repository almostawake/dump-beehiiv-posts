import { getAllPosts, enrichPostsWithContent } from './fn-posts.js';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  try {
    // Process command line arguments
    const args = process.argv.slice(2);
    let startIndex = 0;
    
    if (args.length > 0) {
      const startArg = parseInt(args[0]);
      if (!isNaN(startArg) && startArg >= 0) {
        startIndex = startArg;
      }
    }
    
    // Step 1: Get all posts from the API
    const posts = await getAllPosts();
    
    if (posts.length === 0) {
      console.log('No posts found.');
      return;
    }
    
    // Step 2: Enrich each post with detailed content and save to files
    console.log(`\nEnriching ${posts.length} posts with detailed content${startIndex > 0 ? ` starting from index ${startIndex}` : ''}...`);
    
    const enrichedPosts = await enrichPostsWithContent(posts, startIndex);
    
    console.log(`\nCompleted processing ${enrichedPosts.length} posts.`);
    console.log(`All posts have been saved to the 'posts' directory.`);
    
    // Print a hint about how to resume if needed
    if (enrichedPosts.length < posts.length) {
      const nextIndex = startIndex + enrichedPosts.length;
      console.log(`\nTo resume from where you left off, run: npm run get -- ${nextIndex}`);
    }
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

main().catch(console.error);