"use server";

import { env } from "@/shared/config/env";
import { auth } from "@/shared/lib/auth/server";
import { bedrockAgentClient } from "@/shared/lib/aws";
import { GetIngestionJobCommand } from "@aws-sdk/client-bedrock-agent";
import { headers } from "next/headers";

export interface SyncStatusResult {
  success: boolean;
  status?: string;
  error?: string;
  details?: {
    startedAt?: Date;
    updatedAt?: Date;
    statistics?: {
      numberOfDocumentsScanned?: number;
      numberOfNewDocumentsIndexed?: number;
      numberOfModifiedDocumentsIndexed?: number;
      numberOfDocumentsDeleted?: number;
      numberOfDocumentsFailed?: number;
    };
  };
}

export async function getSyncStatus(jobId: string): Promise<SyncStatusResult> {
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

    if (!jobId) {
      return {
        success: false,
        error: "Job ID is required.",
      };
    }

    const command = new GetIngestionJobCommand({
      knowledgeBaseId: env.AWS_BEDROCK_KB_ID,
      dataSourceId: env.AWS_DATA_SOURCE_ID,
      ingestionJobId: jobId,
    });

    const response = await bedrockAgentClient.send(command);
    const job = response.ingestionJob;

    return {
      success: true,
      status: job?.status,
      details: {
        startedAt: job?.startedAt,
        updatedAt: job?.updatedAt,
        statistics: job?.statistics,
      },
    };
  } catch (error) {
    console.error("Error getting sync status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get sync status.",
    };
  }
}