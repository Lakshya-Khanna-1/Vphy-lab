export type ObservationRow = Record<string, unknown>;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function observationColumns(rows: readonly ObservationRow[]): string[] {
  return [...new Set(rows.flatMap((row) => Object.keys(row)))];
}

export function formatObservation(value: unknown): string {
  if (value === null || value === undefined) return "";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

function csvCell(value: unknown): string {
  let text = formatObservation(value);
  // Spreadsheet programs execute formulas even when the CSV field is quoted.
  if (typeof value === "string" && /^[\s]*[=+\-@]/.test(text))
    text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function observationsToCSV(rows: readonly ObservationRow[]): string {
  if (rows.length === 0) return "";
  const columns = observationColumns(rows);
  return [
    columns.map(csvCell).join(","),
    ...rows.map((row) => columns.map((key) => csvCell(row[key])).join(",")),
  ].join("\r\n");
}
