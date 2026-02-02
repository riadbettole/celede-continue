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

export async function addDocumentToKnowledgeBase(s3Uri: string, documentId: string) {
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

    const command = new BatchPutDocumentCommand({
      knowledgeBaseId: env.AWS_BEDROCK_KB_ID,
      dataSourceId: env.AWS_BEDROCK_DATA_SOURCE_ID,
      documents: [
        {
          documentIdentifier: documentId,
          s3Location: {
            uri: s3Uri,
          },
        },
      ],
    });

    const response = await bedrockAgentClient.send(command);

    console.log("Document added to KB:", response);

    return {
      success: true,
      documentId,
    };
  } catch (error) {
    console.error("Error adding document to KB:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add document.",
    };
  }
}