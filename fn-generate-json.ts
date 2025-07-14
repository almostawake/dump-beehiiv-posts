import fs from "fs/promises";
import path from "path";
import { BeehiivPost } from "./types.js";

export interface JsonRecord {
  title: string;
  url: string;
  date: string;
  markdown: string;
}

/**
 * Generates JSON content from all posts in the posts directory
 */
export async function generateJson(
  postsDir: string,
  markdownDir: string
): Promise<JsonRecord[]> {
  const files = await fs.readdir(postsDir);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));
  const records: JsonRecord[] = [];

  for (const file of jsonFiles) {
    const postPath = path.join(postsDir, file);
    const postWrapper = JSON.parse(await fs.readFile(postPath, "utf-8"));
    const postData = postWrapper.data || postWrapper; // Handle both nested and flat structures

    // Get corresponding markdown file
    const slug = path.basename(file, ".json");
    const markdownPath = path.join(markdownDir, `${slug}.md`);

    let markdownContent = "";
    try {
      const fullMarkdown = await fs.readFile(markdownPath, "utf-8");
      // Remove the title, date, and URL prefix that gets added to markdown files
      // Look for the pattern and extract just the content after "Article URL: ..."
      const contentMatch = fullMarkdown.match(
        /Article URL: [^\n]*\n\n([\s\S]*)/
      );
      markdownContent = contentMatch ? contentMatch[1] : fullMarkdown;
    } catch (error) {
      console.warn(`Warning: Could not read markdown file for ${slug}`);
    }

    // Extract date from publish_date or created_at - format as Sydney timezone ISO date only
    let date = "";
    if (postData.publish_date) {
      date = new Date(postData.publish_date * 1000).toLocaleDateString(
        "en-CA",
        { timeZone: "Australia/Sydney" }
      );
    } else if (postData.created) {
      date = new Date(postData.created * 1000).toLocaleDateString("en-CA", {
        timeZone: "Australia/Sydney",
      });
    } else if (postData.created_at) {
      date = new Date(postData.created_at).toLocaleDateString("en-CA", {
        timeZone: "Australia/Sydney",
      });
    }

    // Use web_url from the original JSON data instead of constructing manually
    const url = postData.web_url || "";

    records.push({
      title: postData.title || "",
      url: url,
      date: date,
      markdown: markdownContent,
    });
  }

  // Sort by date (newest first)
  records.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return records;
}
