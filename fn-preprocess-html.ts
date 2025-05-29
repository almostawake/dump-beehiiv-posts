import { JSDOM } from 'jsdom';

/**
 * Preprocess HTML content to remove unwanted elements
 * @param htmlContent The HTML content to preprocess
 */
export function preprocessHtml(htmlContent: string): string {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  
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
      dom.window.NodeFilter.SHOW_TEXT
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
  
  // Look for standalone Comment button and remove everything from that point down
  // Equivalent to XPath: //a[normalize-space(text()) = 'Comment']/ancestor::tr[2]
  const commentLinks = Array.from(document.querySelectorAll('a')).filter(
    link => link.textContent && link.textContent.trim() === 'Comment'
  );
  
  commentLinks.forEach(commentLink => {
    // Find the second TR ancestor (equivalent to ancestor::tr[2])
    let currentElement = commentLink.parentElement;
    let trCount = 0;
    let targetTr = null;
    
    while (currentElement) {
      if (currentElement.tagName === 'TR') {
        trCount++;
        if (trCount === 2) {
          targetTr = currentElement;
          break;
        }
      }
      currentElement = currentElement.parentElement;
    }
    
    if (targetTr) {
      // Remove this TR and all directly following siblings at the same level
      const parent = targetTr.parentElement;
      if (parent) {
        const elementsToRemove: Element[] = [];
        let currentSibling = targetTr;
        
        // Collect the target TR and all following siblings
        while (currentSibling) {
          elementsToRemove.push(currentSibling);
          currentSibling = currentSibling.nextElementSibling;
        }
        
        // Remove all collected elements
        elementsToRemove.forEach(element => element.remove());
      }
    }
  });

  // Clean up headings to remove all formatting
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    // Get just the text content, which removes all inner HTML formatting
    const plainText = heading.textContent || '';
    // Clear the heading and set it to plain text only
    heading.innerHTML = plainText.trim();
  });
  
  return document.body.innerHTML;
}