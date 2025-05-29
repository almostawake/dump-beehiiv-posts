/**
 * Remove unwanted text and their containing elements
 * @param document The DOM document to process
 */
export function removeUnwantedText(document: Document, NodeFilter: any): void {
  // List of text strings to look for and remove their containing elements
  const textsToRemove = [
    'Read Online',
    'Andrew Walker',
    'OPEN_TRACKING_PIXEL',
    'Did someone forward this email to you?',
    'Back issues available',
    '228 Park Ave'
  ];
  
  textsToRemove.forEach(text => {
    // Find all text nodes containing the target text
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );
    
    const nodesToRemove: Element[] = [];
    let node: Node | null;
    
    while (node = walker.nextNode()) {
      if (node.textContent && node.textContent.includes(text)) {
        // Find the appropriate container element to remove
        let elementToRemove: Element | null = null;
        
        // For "228 Park Ave", remove the entire table
        if (text === '228 Park Ave') {
          elementToRemove = node.parentElement;
          while (elementToRemove && elementToRemove.tagName !== 'TABLE') {
            elementToRemove = elementToRemove.parentElement;
          }
        } else {
          // For other texts, remove the tr element
          elementToRemove = node.parentElement;
          while (elementToRemove && elementToRemove.tagName !== 'TR') {
            elementToRemove = elementToRemove.parentElement;
          }
        }
        
        if (elementToRemove) {
          nodesToRemove.push(elementToRemove);
        }
      }
    }
    
    // Remove all found elements
    nodesToRemove.forEach(element => {
      element.remove();
    });
  });
}