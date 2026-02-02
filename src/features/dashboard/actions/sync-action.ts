"use server";

import { env } from "@/shared/config/env";
import { auth } from "@/shared/lib/auth/server";
import { bedrockAgentClient } from "@/shared/lib/aws";
import { SyncResult } from "@/shared/lib/aws/types";
import { StartIngestionJobCommand } from "@aws-sdk/client-bedrock-agent";
import { headers } from "next/headers";

export async function syncKnowledgeBase(): Promise<SyncResult> {
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

    const command = new StartIngestionJobCommand({
      knowledgeBaseId: env.AWS_BEDROCK_KB_ID,
      dataSourceId: env.AWS_DATA_SOURCE_ID, // You'll need to add this to env
    });
    
    const response = await bedrockAgentClient.send(command);

    return {
      success: true,
      jobId: response.ingestionJob?.ingestionJobId,
    };
  } catch (error) {
    console.error("Error syncing knowledge base:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to sync knowledge base.",
    };
  }
}
