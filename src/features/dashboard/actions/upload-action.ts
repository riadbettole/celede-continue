"use server";

import { env } from "@/shared/config/env";
import { auth } from "@/shared/lib/auth/server";
import { s3Client } from "@/shared/lib/aws";
import { UploadResult } from "@/shared/lib/aws/types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { headers } from "next/headers";
import { sanitizeFileName } from "../file-validation";

export async function uploadPDFToS3(
  formData: FormData
): Promise<UploadResult> {
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

    const file = formData.get("file") as File;

    if (!file) {
      return {
        success: false,
        error: "No file provided.",
      };
    }

    // Validate file type and size on server
    if (file.type !== "application/pdf") {
      return {
        success: false,
        error: "Invalid file type. Only PDF files are allowed.",
      };
    }

    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        error: "File size exceeds 10MB limit.",
      };
    }

    // Generate unique file key
    const timestamp = Date.now();
    const sanitizedName = sanitizeFileName(file.name);
    // const fileKey = `${session.user.id}/${timestamp}-${sanitizedName}`;
    const fileKey = `${timestamp}-${sanitizedName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
        Metadata: {
          userId: session.user.id,
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    await upload.done();

    return {
      success: true,
      fileKey,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed.",
    };
  }
}