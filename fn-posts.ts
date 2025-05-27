import { fetchPostsPage, fetchPostDetail } from './fn-api.js';
import { BeehiivPost } from './types.js';
import fs from 'fs/promises';
import path from 'path';

const POSTS_DIR = 'posts';

export async function getAllPosts(): Promise<BeehiivPost[]> {
  // We'll use an incremental approach since the API doesn't reliably return total count
  let currentPage = 1;
  let allPosts: BeehiivPost[] = [];
  let hasMorePages = true;
  
  console.log('Starting to fetch posts page by page...');
  
  // Keep fetching pages until we get an empty page
  while (hasMorePages) {
    console.log(`Fetching page ${currentPage}...`);
    const pageResponse = await fetchPostsPage(currentPage);
    
    if (pageResponse.data.length > 0) {
      console.log(`Found ${pageResponse.data.length} posts on page ${currentPage}`);
      allPosts = [...allPosts, ...pageResponse.data];
      currentPage++;
    } else {
      hasMorePages = false;
      console.log('Reached the end of available posts');
    }
  }
  
  console.log(`Fetched a total of ${allPosts.length} posts`);
  
  return allPosts;
}

export async function enrichPostsWithContent(posts: BeehiivPost[], startIndex: number = 0): Promise<BeehiivPost[]> {
  const enrichedPosts: BeehiivPost[] = [];
  
  // Make sure the posts directory exists
  await fs.mkdir(POSTS_DIR, { recursive: true });
  
  // Check if we're starting from the beginning or resuming
  if (startIndex > 0) {
    console.log(`Resuming from post ${startIndex + 1}/${posts.length}`);
  }
  
  // Fetch detailed content for each post
  for (let i = startIndex; i < posts.length; i++) {
    const post = posts[i];
    console.log(`Fetching detailed content for post ${i + 1}/${posts.length}: ${post.slug}`);
    
    // Check if this post already exists in the posts directory
    const filePath = path.join(POSTS_DIR, `${post.slug}.json`);
    
    try {
      // Check if file already exists
      try {
        await fs.access(filePath);
        console.log(`  Post already exists, skipping: ${post.slug}`);
        
        // Read the existing file to add to our enriched posts list
        const existingData = await fs.readFile(filePath, 'utf-8');
        const existingPost = JSON.parse(existingData) as BeehiivPost;
        enrichedPosts.push(existingPost);
        
        continue; // Skip to next post
      } catch (err) {
        // File doesn't exist, proceed with fetching
      }
      
      const postWithContent = await fetchPostDetail(post.id);
      
      // Merge the post with content into the enriched post list
      enrichedPosts.push(postWithContent);
      
      // Save each post to a separate file
      await fs.writeFile(filePath, JSON.stringify(postWithContent, null, 2));
      console.log(`  Saved: ${post.slug}`);
      
    } catch (error) {
      console.error(`Failed to fetch content for post ${post.slug}`, error);
      // If we can't get detailed content, just use the list content
      enrichedPosts.push(post);
    }
    
    // Add a small delay to avoid rate limiting
    if (i < posts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return enrichedPosts;
}