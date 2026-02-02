import { z } from "zod";

export const uploadResultSchema = z.object({
  success: z.boolean(),
  fileKey: z.string().optional(),
  error: z.string().optional(),
});

export const syncResultSchema = z.object({
  success: z.boolean(),
  jobId: z.string().optional(),
  error: z.string().optional(),
});

export const queryResultSchema = z.object({
  success: z.boolean(),
  answer: z.string().optional(),
  citations: z
    .array(
      z.object({
        content: z.string(),
        location: z.string().optional(),
      })
    )
    .optional(),
  error: z.string().optional(),
});

export type UploadResult = z.infer<typeof uploadResultSchema>;
export type SyncResult = z.infer<typeof syncResultSchema>;
export type QueryResult = z.infer<typeof queryResultSchema>;