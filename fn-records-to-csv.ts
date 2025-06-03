import { escapeCsvField } from './fn-escape-csv-field.js';

export interface CsvRecord {
  title: string;
  url: string;
  date: string;
  markdown: string;
}

/**
 * Converts an array of CSV records to CSV string format
 */
export function recordsToCsv(records: CsvRecord[]): string {
  const headers = ['title', 'url', 'date', 'markdown'];
  const csvLines = [headers.join(',')];
  
  for (const record of records) {
    const row = [
      escapeCsvField(record.title),
      escapeCsvField(record.url),
      escapeCsvField(record.date),
      escapeCsvField(record.markdown)
    ];
    csvLines.push(row.join(','));
  }
  
  return csvLines.join('\n');
}