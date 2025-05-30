import { JSDOM } from "jsdom";
import { removeUnwantedText } from "./fn-preprocess-html-remove-unwanted-text.js";
import { removeCommentButton } from "./fn-preprocess-html-remove-comment-button-down.js";
import { removeBeehiivFooter } from "./fn-preprocess-html-remove-beehiiv-footer.js";
import {
  removeDisplayNoneElements,
  removeHeaderTr,
} from "./fn-preprocess-html-remove-display-none-elements.js";

/**
 * Preprocess HTML content to remove unwanted elements
 * @param htmlContent The HTML content to preprocess
 */
export function preprocessHtml(htmlContent: string): string {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // Remove all invisible elements (with display: none)
  removeDisplayNoneElements(document);

  // Remove header table row
  removeHeaderTr(document);

  // Remove unwanted text and their containing table rows
  removeUnwantedText(document, dom.window.NodeFilter);

  // Remove beehiiv footer table row
  removeBeehiivFooter(document);

  // Remove Comment button table rows and all those that follow
  removeCommentButton(document);

  return document.body.innerHTML;
}
