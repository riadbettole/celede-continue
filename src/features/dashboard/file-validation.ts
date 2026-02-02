export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_FILE_TYPES = ["application/pdf"];

export function validatePDFFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload a PDF file.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
    };
  }

  return { valid: true };
}

export function sanitizeFileName(fileName: string): string {
  // Remove special characters and spaces
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase();
}