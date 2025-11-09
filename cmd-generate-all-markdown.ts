import { convertPostToMarkdown } from "./fn-convert-post-to-markdown.js";
import { saveCsv } from "./fn-save-csv.js";
import { generateJson } from "./fn-generate-json.js";
import { saveJson } from "./fn-save-json.js";
import { saveAllMarkdown } from "./fn-save-all-markdown.js";
import { recordsToCsv } from "./fn-records-to-csv.js";
import fs from "fs/promises";

// Directories
const POSTS_DIR = "posts";
const MARKDOWN_DIR = "markdown-html";

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
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    console.log(`Found ${jsonFiles.length} posts to process`);

    // Process each post
    for (let i = 0; i < jsonFiles.length; i++) {
      const file = jsonFiles[i];
      console.log(`Processing post ${i + 1}/${jsonFiles.length}: ${file}`);
      await convertPostToMarkdown(file, POSTS_DIR, MARKDOWN_DIR);
    }

    console.log(`\nCompleted processing ${jsonFiles.length} posts.`);
    console.log(
      `Markdown files have been saved to the '${MARKDOWN_DIR}' directory.`
    );

    // Generate both CSV and JSON files from the same data
    console.log("\nGenerating CSV, JSON, and combined Markdown files...");
    const jsonRecords = await generateJson(POSTS_DIR, MARKDOWN_DIR);

    // Save JSON file
    await saveJson(jsonRecords, "all-posts.json");
    console.log("JSON file saved as all-posts.json");

    // Convert to CSV and save
    const csvContent = recordsToCsv(jsonRecords);
    await saveCsv(csvContent, "all-posts.csv");
    console.log("CSV file saved as all-posts.csv");

    // Save combined markdown file
    await saveAllMarkdown(jsonRecords, "all-posts.md");
    console.log("Combined markdown file saved as all-posts.md");
  } catch (error) {
    console.error("Error processing posts:", error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
