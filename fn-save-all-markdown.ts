import fs from "fs/promises";
import { JsonRecord } from "./fn-generate-json.js";

/**
 * Saves all markdown content from records into a single all-posts.md file
 */
export async function saveAllMarkdown(
  records: JsonRecord[],
  filename: string
): Promise<void> {
  let allMarkdown = "";

  for (const record of records) {
    // Add title as heading
    allMarkdown += `# ${record.title}\n\n`;

    // Add metadata
    if (record.date) {
      allMarkdown += `Date Published: ${record.date}\n\n`;
    }
    if (record.url) {
      allMarkdown += `Article URL: ${record.url}\n\n`;
    }

    // Add the markdown content
    allMarkdown += record.markdown;

    // Add separator between posts (3 blank lines for visual separation)
    allMarkdown += "\n\n\n---\n\n\n";
  }

  // Remove the trailing separator
  allMarkdown = allMarkdown.replace(/\n\n\n---\n\n\n$/, "\n");

  await fs.writeFile(filename, allMarkdown, "utf-8");
}



