/**
 * Remove beehiiv footer elements containing "228 Park Ave"
 * Implements XPath equivalent: //p[contains(text(), '228 Park Ave')]/ancestor::tr[4]
 * @param document The DOM document to process
 */
export function removeBeehiivFooter(document: Document): void {
  const allParagraphs = Array.from(document.querySelectorAll('p'));
  
  const targetParagraphs = allParagraphs.filter(p => 
    p.textContent && p.textContent.includes('228 Park Ave')
  );
  
  targetParagraphs.forEach(paragraph => {
    // Find the fourth TR ancestor (equivalent to ancestor::tr[4])
    let currentElement = paragraph.parentElement;
    let trCount = 0;
    let targetTr = null;
    
    while (currentElement) {
      if (currentElement.tagName === 'TR') {
        trCount++;
        if (trCount === 4) {
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