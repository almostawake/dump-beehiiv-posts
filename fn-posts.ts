import { fetchPostsPage, fetchPostDetail } from './fn-api.js';
import { BeehiivPost } from './types.js';
import fs from 'fs/promises';
import path from 'path';

const POSTS_DIR = 'posts';

export async function getExistingPostSlugs(): Promise<Set<string>> {
  const existingSlugs = new Set<string>();
  
  try {
    // Check if posts directory exists
    await fs.access(POSTS_DIR);
    
    // Read all files in the posts directory
    const files = await fs.readdir(POSTS_DIR);
    
    // Extract slugs from .json files
    for (const file of files) {
      if (file.endsWith('.json')) {
        const slug = file.slice(0, -5); // Remove .json extension
        existingSlugs.add(slug);
      }
    }
    
  } catch (error) {
    // Directory doesn't exist or is empty, that's fine
    console.log(`Posts directory doesn't exist yet or is empty`);
  }
  
  return existingSlugs;
}

export async function getAllPosts(): Promise<BeehiivPost[]> {
  // We'll use an incremental approach since the API doesn't reliably return total count
  let currentPage = 1;
  let allPosts: BeehiivPost[] = [];
  let hasMorePages = true;
  
  // Keep fetching pages until we get an empty page
  while (hasMorePages) {
    const pageResponse = await fetchPostsPage(currentPage);
    
    if (pageResponse.data.length > 0) {
      allPosts = [...allPosts, ...pageResponse.data];
      currentPage++;
    } else {
      hasMorePages = false;
    }
  }
  
  return allPosts;
}

export async function enrichPostsWithContent(posts: BeehiivPost[]): Promise<BeehiivPost[]> {
  const enrichedPosts: BeehiivPost[] = [];
  
  // Make sure the posts directory exists
  await fs.mkdir(POSTS_DIR, { recursive: true });
  
  // Fetch detailed content for each post
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    console.log(post.slug);
    
    const filePath = path.join(POSTS_DIR, `${post.slug}.json`);
    
    try {
      const postWithContent = await fetchPostDetail(post.id);
      
      // Merge the post with content into the enriched post list
      enrichedPosts.push(postWithContent);
      
      // Save each post to a separate file
      await fs.writeFile(filePath, JSON.stringify(postWithContent, null, 2));
      
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