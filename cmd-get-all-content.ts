import {
  getAllPosts,
  enrichPostsWithContent,
  getExistingPostSlugs,
} from "./fn-posts.js";
import fs from "fs/promises";
import path from "path";

async function main() {
  try {
    // Step 1: Get existing post slugs from local files
    const existingSlugs = await getExistingPostSlugs();

    // Step 2: Get all posts from the API
    const allPosts = await getAllPosts();

    if (allPosts.length === 0) {
      console.log("No posts found.");
      return;
    }

    // Step 3: Filter out posts we already have
    const newPosts = allPosts.filter((post) => !existingSlugs.has(post.slug));

    console.log(`Found ${allPosts.length} complete posts in Beehiiv`);
    console.log(`Found ${existingSlugs.size} JSON posts locally`);
    console.log("");

    if (newPosts.length === 0) {
      console.log("All posts are already up to date, nothing to see here 😬");
      return;
    }

    // Step 4: Enrich only the new posts with detailed content and save to files
    console.log(`Retrieving ${newPosts.length} new posts:`);

    const enrichedPosts = await enrichPostsWithContent(newPosts);

    console.log(`\nCompleted processing ${enrichedPosts.length} new posts.`);
    console.log(`All posts have been saved to the 'posts' directory.`);
  } catch (error) {
    console.error("Error in main process:", error);
    process.exit(1);
  }
}

main().catch(console.error);
