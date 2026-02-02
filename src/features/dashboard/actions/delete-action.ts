"use server";

import { env } from "@/shared/config/env";
import { auth } from "@/shared/lib/auth/server";
import { s3Client, bedrockAgentClient } from "@/shared/lib/aws";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { StartIngestionJobCommand } from "@aws-sdk/client-bedrock-agent";
import { headers } from "next/headers";

export interface DeleteResult {
  success: boolean;
  error?: string;
  syncJobId?: string;
}

export async function deleteFileFromS3(fileKey: string): Promise<DeleteResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        error: "Unauthorized. Please log in.",
      };
    }

    if (!fileKey) {
      return {
        success: false,
        error: "File key is required.",
      };
    }

    // Delete from S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    });

    await s3Client.send(deleteCommand);

    const syncCommand = new StartIngestionJobCommand({
      knowledgeBaseId: env.AWS_BEDROCK_KB_ID,
      dataSourceId: env.AWS_DATA_SOURCE_ID,
    });

    const syncResponse = await bedrockAgentClient.send(syncCommand);

    return {
      success: true,
      syncJobId: syncResponse.ingestionJob?.ingestionJobId,
    };
  } catch (error) {
    console.error("Error deleting file:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete file.",
    };
  }
}