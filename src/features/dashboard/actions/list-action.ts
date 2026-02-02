"use server";

import { env } from "@/shared/config/env";
import { auth } from "@/shared/lib/auth/server";
import { s3Client } from "@/shared/lib/aws";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { headers } from "next/headers";

export interface S3File {
  key: string;
  fileName: string;
  size: number;
  lastModified: Date;
  userId?: string;
  fileType: string;
}

export interface ListResult {
  success: boolean;
  files?: S3File[];
  error?: string;
}

export async function listUploadedPDFs(): Promise<ListResult> {
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

    const command = new ListObjectsV2Command({
      Bucket: env.AWS_S3_BUCKET_NAME,
    });

    const response = await s3Client.send(command);

    const getFileType = (fileName: string): string => {
      const extension = fileName.split('.').pop()?.toLowerCase() || '';
      const typeMap: Record<string, string> = {
        pdf: 'PDF',
        doc: 'Word',
        docx: 'Word',
        txt: 'Text',
        md: 'Markdown',
        csv: 'CSV',
        xlsx: 'Excel',
        xls: 'Excel',
        pptx: 'PowerPoint',
        ppt: 'PowerPoint',
        jpg: 'Image',
        jpeg: 'Image',
        png: 'Image',
        gif: 'Image',
        svg: 'Image',
        json: 'JSON',
        xml: 'XML',
        html: 'HTML',
        css: 'CSS',
        js: 'JavaScript',
        ts: 'TypeScript',
      };
      return typeMap[extension] || extension.toUpperCase();
    };

    const files: S3File[] =
      response.Contents?.map((item) => {
        const key = item.Key || "";
        const fileName = key.split("/").pop() || key || "";
        return {
          key,
          fileName,
          size: item.Size || 0,
          lastModified: item.LastModified || new Date(),
          fileType: getFileType(fileName),
        };
      }) || [];

    return {
      success: true,
      files: files.filter((file) => file.fileName), // Filter out empty names
    };
  } catch (error) {
    console.error("Error listing files:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to list uploaded files.",
    };
  }
}