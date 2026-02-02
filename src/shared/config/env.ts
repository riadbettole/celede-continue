import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DB_FILE_NAME: z.string(),

    AWS_REGION: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),

    AWS_S3_BUCKET_NAME: z.string().min(1),
    AWS_BEDROCK_KB_ID: z.string().min(1),
    AWS_BEDROCK_MODEL_ARN: z.string().min(1),

    AWS_DATA_SOURCE_ID: z.string().min(1),

    BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
    BETTER_AUTH_URL: z.url().optional(),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z.url().optional(),
    NEXT_PUBLIC_API_URL: z.url().optional(),
  },

  runtimeEnv: {
    DB_FILE_NAME: process.env.DB_FILE_NAME,

    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    AWS_BEDROCK_KB_ID: process.env.AWS_BEDROCK_KB_ID,
    AWS_BEDROCK_MODEL_ARN: process.env.AWS_BEDROCK_MODEL_ARN,

    AWS_DATA_SOURCE_ID: process.env.AWS_DATA_SOURCE_ID,

    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
});

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}