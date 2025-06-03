/**
 * Escapes CSV field content according to RFC 4180
 * - Wraps fields containing commas, quotes, or newlines in double quotes
 * - Escapes double quotes by doubling them
 */
export function escapeCsvField(field: string | null | undefined): string {
  // Handle null/undefined values
  if (field == null) {
    return '';
  }
  
  // Convert to string if not already
  const fieldStr = String(field);
  
  // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n') || fieldStr.includes('\r')) {
    return '"' + fieldStr.replace(/"/g, '""') + '"';
  }
  return fieldStr;
}