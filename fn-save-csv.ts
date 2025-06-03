import fs from 'fs/promises';

/**
 * Saves CSV content to file
 */
export async function saveCsv(csvContent: string, outputPath: string): Promise<void> {
  await fs.writeFile(outputPath, csvContent, 'utf-8');
}