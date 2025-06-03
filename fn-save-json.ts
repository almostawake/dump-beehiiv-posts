import fs from 'fs/promises';
import { JsonRecord } from './fn-generate-json.js';

/**
 * Saves JSON content to file
 */
export async function saveJson(jsonRecords: JsonRecord[], outputPath: string): Promise<void> {
  const jsonContent = JSON.stringify(jsonRecords, null, 2);
  await fs.writeFile(outputPath, jsonContent, 'utf-8');
}