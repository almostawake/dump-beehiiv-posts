import { JSDOM } from "jsdom";

/**
 * Remove elements that have display: none in their style
 * @param document The DOM document to process
 */
export function removeDisplayNoneElements(document: Document): void {
  const allElements = document.getElementsByTagName("*");

  // Convert to array to avoid live NodeList issues during removal
  const elements = Array.from(allElements);

  elements.forEach((element) => {
    // Check if element has style attribute
    if (element.hasAttribute("style")) {
      const style = element.getAttribute("style");
      // Use case-insensitive regex to match display:none with optional spaces
      if (style && /display\s*:\s*none/i.test(style)) {
        element.remove();
      }
    }
  });
}

/**
 * Remove the header TR element if it contains an H1
 * @param document The DOM document to process
 */
export function removeHeaderTr(document: Document): void {
  const headerTr = document.querySelector("tr#header");
  if (headerTr) {
    const h1 = headerTr.querySelector("h1");
    if (h1) {
      headerTr.remove();
    }
  }
}
