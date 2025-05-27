import { getAllPosts } from './fn-posts.js';

async function main() {
  try {
    // Get all posts from the API (without fetching detailed content)
    const posts = await getAllPosts();
    
    if (posts.length === 0) {
      console.log('No posts found.');
      return;
    }
    
    // Print each post's slug
    console.log('\nPost Slugs:');
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.slug}`);
    });
    
    // Print total count
    console.log(`\nTotal posts: ${posts.length}`);
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

main().catch(console.error);