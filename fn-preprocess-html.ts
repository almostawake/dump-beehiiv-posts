import { JSDOM } from "jsdom";
import { removeUnwantedText } from "./fn-preprocess-html-remove-unwanted-text.js";
import { removeCommentButton } from "./fn-preprocess-html-remove-comment-button.js";
import { removeSocials } from "./fn-preprocess-html-remove-socials.js";
import { cleanHeadings } from "./fn-preprocess-html-clean-headings.js";
import { removeBeehiivFooter } from "./fn-preprocess-html-remove-beehiiv-footer.js";

/**
 * Preprocess HTML content to remove unwanted elements
 * @param htmlContent The HTML content to preprocess
 */
export function preprocessHtml(htmlContent: string): string {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // Remove unwanted text and their containing elements
  removeUnwantedText(document, dom.window.NodeFilter);

  // Remove social sharing elements
  removeSocials(document);

  // Remove beehiiv footer elements
  removeBeehiivFooter(document);

  // Remove Comment button and everything from that point down
  removeCommentButton(document);

  // Clean up headings to remove all formatting
  //cleanHeadings(document);

  return document.body.innerHTML;
}
