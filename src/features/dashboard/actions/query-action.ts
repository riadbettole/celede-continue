"use server";

import { env } from "@/shared/config/env";
import { auth } from "@/shared/lib/auth/server";
import { bedrockAgentRuntimeClient } from "@/shared/lib/aws";
import { QueryResult } from "@/shared/lib/aws/types";
import { RetrieveAndGenerateCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { headers } from "next/headers";

export async function queryKnowledgeBase(
  query: string
): Promise<QueryResult> {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        error: "Unauthorized. Please log in.",
      };
    }

    if (!query || query.trim().length === 0) {
      return {
        success: false,
        error: "Query cannot be empty.",
      };
    }

    const command = new RetrieveAndGenerateCommand({
      input: {
        text: query,
      },
      retrieveAndGenerateConfiguration: {
        type: "KNOWLEDGE_BASE",
        knowledgeBaseConfiguration: {
          knowledgeBaseId: env.AWS_BEDROCK_KB_ID,
          modelArn: env.AWS_BEDROCK_MODEL_ARN,
        },
      },
    });

    const response = await bedrockAgentRuntimeClient.send(command);

    // Extract citations
    const citations =
      response.citations?.map((citation) => ({
        content:
          citation.generatedResponsePart?.textResponsePart?.text || "",
        location:
          citation.retrievedReferences?.[0]?.location?.s3Location?.uri || "",
      })) || [];

    return {
      success: true,
      answer: response.output?.text || "No answer generated.",
      citations,
    };
  } catch (error) {
    console.error("Error querying knowledge base:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to query knowledge base.",
    };
  }
}