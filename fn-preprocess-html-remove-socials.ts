/**
 * Remove social sharing elements
 * Equivalent to XPath: //img[@alt = 'share on linkedin']/ancestor::tr[5]
 * @param document The DOM document to process
 */
export function removeSocials(document: Document): void {
  const linkedinImages = Array.from(document.querySelectorAll('img')).filter(
    img => img.getAttribute('alt') === 'share on linkedin'
  );
  
  linkedinImages.forEach(linkedinImg => {
    // Find the fifth TR ancestor (equivalent to ancestor::tr[5])
    let currentElement = linkedinImg.parentElement;
    let trCount = 0;
    let targetTr = null;
    
    while (currentElement) {
      if (currentElement.tagName === 'TR') {
        trCount++;
        if (trCount === 5) {
          targetTr = currentElement;
          break;
        }
      }
      currentElement = currentElement.parentElement;
    }
    
    if (targetTr) {
      // Remove the TR element
      targetTr.remove();
    }
  });
}