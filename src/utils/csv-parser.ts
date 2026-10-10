/**
 * Robust RFC 4180 Compliant CSV Parser & Data Profiler
 * Designed for client-side processing of Kaggle datasets and custom CSV files.
 */

export type InferredDataType = "numeric" | "categorical" | "boolean" | "datetime";
export type InferredColumnType = InferredDataType;

export interface ColumnStats {
    min?: number;
    max?: number;
    mean?: number;
    std?: number;
}

export interface ColumnMetadata {
    name: string;
    originalName: string;
    inferredType: InferredDataType;
    userType: InferredDataType;
    nullCount: number;
    nullPercentage: number;
    missingCount: number;
    missingPercent: number;
    uniqueCount: number;
    sampleValues: string[];
    stats?: ColumnStats;
    isSuspectedId?: boolean;
    isSuggestedId?: boolean;
    isSuggestedTarget?: boolean;
}

export interface ParsedDataset {
    fileName: string;
    filename: string;
    fileSizeBytes: number;
    headers: string[];
    columns: ColumnMetadata[];
    rowCount: number;
    columnCount: number;
    previewRows: Record<string, string>[]; // first 100 rows for high-perf UI preview
    rows: Record<string, string>[]; // alias for previewRows in UI components
    rawRows: string[][]; // complete in-memory rows for processing
    csvContent: string; // raw cleaned CSV string for Pyodide mounting
    suggestedTask: "classification" | "regression" | "clustering";
    suggestedTarget?: string;
    warnings: string[];
}

export interface CSVParseOptions {
    maxRows?: number;
    previewLimit?: number;
}

const DEFAULT_PREVIEW_LIMIT = 50;
const MAX_ALLOWED_ROWS = 50000;

/**
 * Strips UTF-8 Byte Order Mark (BOM) if present
 */
export function stripBOM(content: string): string {
    if (content.charCodeAt(0) === 0xfeff) {
        return content.slice(1);
    }
    return content;
}

/**
 * Sanitizes cell values to prevent CSV formula injection when exporting
 */
export function sanitizeCellValueForExport(value: string): string {
    if (typeof value !== "string") return String(value ?? "");
    const trimmed = value.trim();
    if (
        trimmed.startsWith("=") ||
        trimmed.startsWith("+") ||
        trimmed.startsWith("-") ||
        trimmed.startsWith("@") ||
        trimmed.startsWith("\t") ||
        trimmed.startsWith("\r")
    ) {
        return "'" + value;
    }
    return value;
}

/**
 * Full RFC 4180 State-Machine CSV Parser
 * Supports commas in quotes, escaped quotes (""), newlines in quotes, mixed linebreaks.
 */
export function parseRawCSV(
    rawText: string,
    options: CSVParseOptions = {}
): { headers: string[]; rows: string[][]; warnings: string[] } {
    const text = stripBOM(rawText);
    const warnings: string[] = [];
    const maxRows = options.maxRows ?? MAX_ALLOWED_ROWS;

    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = "";
    let insideQuotes = false;
    const len = text.length;

    for (let i = 0; i < len; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (insideQuotes) {
            if (char === '"') {
                if (nextChar === '"') {
                    // Escaped quote: "" -> "
                    currentCell += '"';
                    i++; // skip next quote
                } else {
                    // Closing quote
                    insideQuotes = false;
                }
            } else {
                currentCell += char;
            }
        } else {
            if (char === '"') {
                // Opening quote
                insideQuotes = true;
            } else if (char === ",") {
                // Field delimiter
                currentRow.push(currentCell.trim());
                currentCell = "";
            } else if (char === "\r") {
                if (nextChar === "\n") {
                    i++; // Handle CRLF
                }
                currentRow.push(currentCell.trim());
                currentCell = "";
                if (currentRow.some((cell) => cell.length > 0)) {
                    rows.push(currentRow);
                }
                currentRow = [];
                if (rows.length >= maxRows + 1) {
                    warnings.push(`Dataset dipotong pada ${maxRows} baris pertama untuk stabilitas komputasi browser.`);
                    break;
                }
            } else if (char === "\n") {
                // Linefeed delimiter
                currentRow.push(currentCell.trim());
                currentCell = "";
                if (currentRow.some((cell) => cell.length > 0)) {
                    rows.push(currentRow);
                }
                currentRow = [];
                if (rows.length >= maxRows + 1) {
                    warnings.push(`Dataset dipotong pada ${maxRows} baris pertama untuk stabilitas komputasi browser.`);
                    break;
                }
            } else {
                currentCell += char;
            }
        }
    }

    // Flush remaining cell/row
    if (currentCell.length > 0 || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        if (currentRow.some((cell) => cell.length > 0)) {
            rows.push(currentRow);
        }
    }

    if (rows.length === 0) {
        return { headers: [], rows: [], warnings: ["File CSV kosong atau tidak memiliki data yang valid."] };
    }

    // Extract headers (first row) and normalize
    const rawHeaders = rows[0];
    const dataRows = rows.slice(1);

    if (dataRows.length === 0) {
        return { headers: rawHeaders, rows: [], warnings: ["File CSV hanya berisi header dan tidak memiliki baris data."] };
    }

    // Disambiguate duplicate or empty column headers
    const headerCounts: Record<string, number> = {};
    const sanitizedHeaders: string[] = [];

    rawHeaders.forEach((h, idx) => {
        let name = h.trim();
        if (!name) {
            name = `col_${idx}`;
        }
        if (headerCounts[name] !== undefined) {
            sanitizedHeaders.push(`${name}_${headerCounts[name]}`);
            headerCounts[name]++;
            warnings.push(`Header duplikat '${name}' diubah menjadi '${sanitizedHeaders[sanitizedHeaders.length - 1]}'.`);
        } else {
            headerCounts[name] = 1;
            sanitizedHeaders.push(name);
        }
    });

    // Ensure all data rows match header count by padding empty strings or trimming
    const headerLen = sanitizedHeaders.length;
    const alignedRows = dataRows.map((row) => {
        if (row.length < headerLen) {
            return [...row, ...new Array(headerLen - row.length).fill("")];
        }
        return row.slice(0, headerLen);
    });

    return {
        headers: sanitizedHeaders,
        rows: alignedRows,
        warnings,
    };
}

/**
 * Checks if a string is a standard date format
 */
function isDateString(val: string): boolean {
    if (val.length < 6 || val.length > 35) return false;
    // Common date patterns like YYYY-MM-DD or DD/MM/YYYY
    const datePattern = /^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|^\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}/;
    if (!datePattern.test(val)) return false;
    const timestamp = Date.parse(val);
    return !isNaN(timestamp);
}

/**
 * Profiles dataset columns, infers data types conservatively, and calculates summary metrics
 */
export function profileColumns(
    headers: string[],
    dataRows: string[][]
): { columns: ColumnMetadata[]; suggestedTask: "classification" | "regression" | "clustering"; suggestedTarget?: string; warnings: string[] } {
    const totalRows = dataRows.length;
    const warnings: string[] = [];
    const columns: ColumnMetadata[] = [];

    headers.forEach((colName, colIdx) => {
        let nullCount = 0;
        const values: string[] = [];
        const uniqueSet = new Set<string>();

        let numericCount = 0;
        let booleanCount = 0;
        let dateCount = 0;
        const numericValues: number[] = [];

        for (let r = 0; r < totalRows; r++) {
            const rawVal = dataRows[r][colIdx];
            const trimmed = rawVal !== undefined ? rawVal.trim() : "";
            const lower = trimmed.toLowerCase();
            if (
                trimmed === "" ||
                lower === "nan" ||
                lower === "null" ||
                lower === "na" ||
                lower === "n/a" ||
                lower === "none" ||
                trimmed === "?"
            ) {
                nullCount++;
            } else {
                values.push(trimmed);
                uniqueSet.add(trimmed);

                // Check boolean
                const lower = trimmed.toLowerCase();
                if (lower === "true" || lower === "false" || lower === "yes" || lower === "no") {
                    booleanCount++;
                }

                // Check numeric
                const num = Number(trimmed);
                if (!isNaN(num) && isFinite(num)) {
                    numericCount++;
                    numericValues.push(num);
                } else if (isDateString(trimmed)) {
                    dateCount++;
                }
            }
        }

        const validCount = values.length;
        const nullPercentage = Number(((nullCount / (totalRows || 1)) * 100).toFixed(1));

        let inferredType: InferredDataType = "categorical";

        if (validCount > 0) {
            if (numericCount / validCount >= 0.9) {
                // If mostly numeric
                // Check if it's an ID column with leading zeroes e.g. "00123"
                const hasLeadingZeroes = values.some(
                    (v) => v.length > 1 && v.startsWith("0") && !v.startsWith("0.")
                );
                if (hasLeadingZeroes) {
                    inferredType = "categorical";
                } else {
                    inferredType = "numeric";
                }
            } else if (booleanCount / validCount >= 0.9) {
                inferredType = "boolean";
            } else if (dateCount / validCount >= 0.85) {
                inferredType = "datetime";
            } else {
                inferredType = "categorical";
            }
        }

        // Calculate numeric stats if numeric
        let stats: ColumnStats | undefined;
        if (inferredType === "numeric" && numericValues.length > 0) {
            const min = Math.min(...numericValues);
            const max = Math.max(...numericValues);
            const sum = numericValues.reduce((a, b) => a + b, 0);
            const mean = sum / numericValues.length;
            const variance =
                numericValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (numericValues.length || 1);
            const std = Math.sqrt(variance);

            stats = {
                min: Number(min.toFixed(3)),
                max: Number(max.toFixed(3)),
                mean: Number(mean.toFixed(3)),
                std: Number(std.toFixed(3)),
            };
        }

        // Detect potential ID column
        const isSuspectedId =
            (uniqueSet.size === totalRows && totalRows > 10) ||
            /^(id|id_|index|_id|user_?id|cust_?id|customer_?id|passenger_?id)$/i.test(colName);

        // Detect suggested target column
        const lowerCol = colName.toLowerCase();
        const isSuggestedTarget =
            /^(target|label|class|survived|outcome|churn|price|y|salary|diagnosis|species)$/i.test(lowerCol) ||
            (colIdx === headers.length - 1 && uniqueSet.size > 1 && uniqueSet.size <= 20);

        if (nullPercentage > 30) {
            warnings.push(
                `Kolom '${colName}' memiliki ${nullPercentage}% data kosong. Pertimbangkan imputasi atau eksklusi.`
            );
        }

        if (uniqueSet.size === 1 && totalRows > 5) {
            warnings.push(`Kolom '${colName}' hanya memiliki 1 nilai unik (konstan) dan tidak memiliki daya pembeda.`);
        }

        columns.push({
            name: colName,
            originalName: colName,
            inferredType,
            userType: inferredType,
            nullCount,
            nullPercentage,
            missingCount: nullCount,
            missingPercent: nullPercentage,
            uniqueCount: uniqueSet.size,
            sampleValues: Array.from(uniqueSet).slice(0, 5),
            stats,
            isSuspectedId,
            isSuggestedId: isSuspectedId,
            isSuggestedTarget,
        });
    });

    // Detect suggested task
    const candidateTarget =
        columns.find((c) => c.isSuggestedTarget && !c.isSuspectedId) ||
        columns[columns.length - 1];

    let suggestedTask: "classification" | "regression" | "clustering" = "classification";
    if (candidateTarget) {
        if (candidateTarget.inferredType === "numeric" && candidateTarget.uniqueCount > 25) {
            suggestedTask = "regression";
        } else if (candidateTarget.uniqueCount >= 2 && candidateTarget.uniqueCount <= 20) {
            suggestedTask = "classification";
        }
    } else {
        suggestedTask = "clustering";
    }

    return {
        columns,
        suggestedTask,
        suggestedTarget: candidateTarget?.name,
        warnings,
    };
}

/**
 * Top-level dataset loader and profiler for Kaggle CSV files
 */
export function parseAndProfileCSV(
    file: { name: string; size: number; text: string },
    options: CSVParseOptions = {}
): ParsedDataset {
    const { headers, rows, warnings: parseWarnings } = parseRawCSV(file.text, options);
    const { columns, suggestedTask, suggestedTarget, warnings: profileWarnings } = profileColumns(headers, rows);

    const previewLimit = options.previewLimit ?? DEFAULT_PREVIEW_LIMIT;
    const previewRows: Record<string, string>[] = rows.slice(0, previewLimit).map((row) => {
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
            obj[h] = row[i] ?? "";
        });
        return obj;
    });

    return {
        fileName: file.name,
        filename: file.name,
        fileSizeBytes: file.size,
        headers,
        columns,
        rowCount: rows.length,
        columnCount: headers.length,
        previewRows,
        rows: previewRows,
        rawRows: rows,
        csvContent: file.text,
        suggestedTask,
        suggestedTarget,
        warnings: [...parseWarnings, ...profileWarnings],
    };
}

/**
 * Convenience helper to parse a CSV text string directly
 */
export function parseCSV(
    csvText: string,
    options: { filename?: string; maxRowsToParse?: number; previewLimit?: number } = {}
): ParsedDataset {
    return parseAndProfileCSV(
        {
            name: options.filename || "custom_data.csv",
            size: csvText.length,
            text: csvText,
        },
        {
            maxRows: options.maxRowsToParse,
            previewLimit: options.previewLimit,
        }
    );
}
