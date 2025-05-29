/**
 * Clean up headings to remove all formatting
 * @param document The DOM document to process
 */
export function cleanHeadings(document: Document): void {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    // Get just the text content, which removes all inner HTML formatting
    const plainText = heading.textContent || '';
    // Clear the heading and set it to plain text only
    heading.innerHTML = plainText.trim();
  });
}