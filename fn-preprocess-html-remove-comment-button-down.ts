/**
 * Remove Comment button and everything from that point down
 * Equivalent to XPath: //a[normalize-space(text()) = 'Comment']/ancestor::tr[2]
 * @param document The DOM document to process
 */
export function removeCommentButton(document: Document): void {
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
        let currentSibling: Element | null = targetTr;
        
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
}