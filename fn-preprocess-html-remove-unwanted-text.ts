/**
 * Remove unwanted text and their containing table rows
 * @param document The DOM document to process
 */
export function removeUnwantedText(document: Document, NodeFilter: any): void {
  // List of text strings to look for and remove their containing elements
  const textsToRemove = [
    "Andrew Walker",
    "Did someone forward this email to you?",
    "Back issues available",
  ];

  textsToRemove.forEach((text) => {
    // Find all text nodes containing the target text
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );

    const nodesToRemove: Element[] = [];
    let node: Node | null;

    while ((node = walker.nextNode())) {
      if (node.textContent && node.textContent.includes(text)) {
        // Find the appropriate container element to remove
        let elementToRemove: Element | null = null;

        // Remove the tr element
        elementToRemove = node.parentElement;
        while (elementToRemove && elementToRemove.tagName !== "TR") {
          elementToRemove = elementToRemove.parentElement;
        }

        if (elementToRemove) {
          nodesToRemove.push(elementToRemove);
        }
      }
    }

    // Remove all found elements
    nodesToRemove.forEach((element) => {
      element.remove();
    });
  });
}
