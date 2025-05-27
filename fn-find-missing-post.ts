import { getAllPosts } from './fn-posts.js';
import fs from 'fs/promises';
import path from 'path';

const POSTS_DIR = 'posts';

async function main() {
  try {
    // Get all posts from the API
    const posts = await getAllPosts();
    console.log(`API returned ${posts.length} posts`);
    
    // Get all files in the posts directory
    let files = [];
    try {
      files = await fs.readdir(POSTS_DIR);
      files = files.filter(file => file.endsWith('.json'));
    } catch (error) {
      console.error(`Error reading directory: ${error}`);
      process.exit(1);
    }
    
    console.log(`Found ${files.length} files in ${POSTS_DIR} directory`);
    
    // Convert filenames to slugs (remove .json extension)
    const fileSlugs = files.map(file => file.replace('.json', ''));
    
    // Get all slugs from the API
    const apiSlugs = posts.map(post => post.slug);
    
    // Find missing posts (in API but not in files)
    const missingSlugs = apiSlugs.filter(slug => !fileSlugs.includes(slug));
    console.log(`\nMissing posts (in API but not in files): ${missingSlugs.length}`);
    missingSlugs.forEach(slug => {
      const post = posts.find(p => p.slug === slug);
      console.log(`- ${slug} (ID: ${post?.id}, Title: ${post?.title})`);
    });
    
    // Find extra files (in files but not in API)
    const extraSlugs = fileSlugs.filter(slug => !apiSlugs.includes(slug));
    console.log(`\nExtra files (in files but not in API): ${extraSlugs.length}`);
    extraSlugs.forEach(slug => {
      console.log(`- ${slug}`);
    });
    
    // Find duplicates in API
    const duplicateSlugs = apiSlugs.filter((slug, index) => apiSlugs.indexOf(slug) !== index);
    console.log(`\nDuplicate slugs in API: ${duplicateSlugs.length}`);
    duplicateSlugs.forEach(slug => {
      const duplicates = posts.filter(p => p.slug === slug);
      console.log(`- ${slug} appears ${duplicates.length} times:`);
      duplicates.forEach(post => {
        console.log(`  ID: ${post.id}, Title: ${post.title}`);
      });
    });
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main().catch(console.error);