# Claude's Memory for Beehiiv Posts Utility

## Project Overview
This TypeScript utility helps manage Beehiiv posts from the command line.
Main features include:
- Fetching posts from the Beehiiv API
- Retrieving detailed content for each post
- Storing enriched post data as individual JSON files

## Environment Variables
- `BEEHIIV_API_KEY`: API key for Beehiiv
- `BEEHIIV_PUBLICATION_ID`: Publication ID to work with

## Commands
- `npm run get`: Fetch all posts with detailed content and save to JSON files
- `npm run get -- <index>`: Resume fetching posts from a specific index (useful for continuing after timeouts)
- `npm run lst`: List all post slugs without fetching detailed content  
- `npm run gen`: Convert all posts to Markdown and HTML formats and save to the markdown-html directory (extracts HTML from JSON files, cleans formatting)

## File Structure

### Entry Points (Executable Scripts)
- `get-all-content.ts`: Main entry point for fetching all posts with content
- `list-posts.ts`: Script for listing all post slugs without fetching content
- `generate-all-markdown.ts`: Script for converting all posts to Markdown and HTML with preprocessing

### Function Modules
- `fn-api.ts`: API functions for interacting with Beehiiv
- `fn-posts.ts`: Functions for processing and enriching posts
- `fn-html-to-markdown.ts`: Functions for converting HTML to Markdown
- `fn-extract-post-content.ts`: Functions for extracting and converting individual posts
- `fn-find-missing-post.ts`: Functions for finding missing posts between API and local files

### Support Files
- `types.ts`: TypeScript type definitions
- `tsconfig.json`: TypeScript configuration
- `package.json`: Project dependencies and scripts

### Data Directories
- `posts/`: Directory storing enriched post data as JSON files
- `markdown-html/`: Directory storing post content as Markdown (.md) and HTML (.html) files
- Post files are named using slugs (as used in URL slugs)

## API Usage
- Base URL: https://api.beehiiv.com/v2
- List posts endpoint: /publications/:publicationId/posts
- Single post endpoint: /publications/:publicationId/posts/:postId?expand=premium_email_content
- Default filter: status=confirmed
- Pagination: API returns up to 100 posts per page

## Implementation Details
- Fetches paginated list of posts (100 per page)
- Continues fetching pages until no more posts are found
- For each post, fetches detailed content with expanded fields
- Includes a small delay between requests to avoid rate limiting
- Saves each post as a separate JSON file in the posts directory
- File contains all post information including HTML content

## Markdown and HTML Conversion
- Extracts HTML content from various possible locations in the JSON structure
- Handles different content structures including `content.premium.email`, `content.premium_email`, and `content.email`
- **HTML Preprocessing**: Removes unwanted email template elements before conversion:
  - Removes table rows containing: "Read Online", "Andrew Walker", "OPEN_TRACKING_PIXEL", "Did someone forward this email to you?", "Back issues available"
  - Removes entire table containing: "228 Park Ave"
  - Strips all formatting (br, em, b, etc.) from headings to ensure clean plain text
- Saves the preprocessed HTML content to .html files
- Uses Turndown.js to convert HTML to Markdown
- Cleans up the converted Markdown to remove HTML/CSS styling
- Preserves formatting for headings, lists, links, and emphasis
- Adds article URL at the top of each Markdown file (title removed as it's already in main document)
- Both HTML and Markdown files use the same slug-based filename in the markdown-html directory

## Development Notes
- TypeScript with ES modules
- Using tsx for running scripts directly
- Using axios for API calls
- Using dotenv for environment variables
- Using jsdom for HTML DOM manipulation and preprocessing
- Using Turndown.js for HTML to Markdown conversion