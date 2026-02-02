"use client";

import { useState, useCallback } from "react";
import { Upload, Loader2, CheckCircle, XCircle } from "lucide-react";
import { validatePDFFile } from "../file-validation";
import { uploadPDFToS3 } from "../actions/upload-action";
import { syncKnowledgeBase } from "../actions/sync-action";
import { SyncStatusTracker } from "./sync-status";
import clsx from "clsx";
import { Button } from "@/shared/components/ui/button";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncJobId, setSyncJobId] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validation = validatePDFFile(selectedFile);
      if (validation.valid) {
        setFile(selectedFile);
        setUploadStatus({ type: null, message: "" });
        setSyncJobId(null);
      } else {
        setUploadStatus({ type: "error", message: validation.error || "" });
        setFile(null);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setUploadStatus({ type: "error", message: "Please select a file" });
      return;
    }

    setUploading(true);
    setUploadStatus({ type: null, message: "" });
    setSyncJobId(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResult = await uploadPDFToS3(formData);

      if (!uploadResult.success) {
        setUploadStatus({
          type: "error",
          message: uploadResult.error || "Upload failed",
        });
        setUploading(false);
        return;
      }

      setSyncing(true);
      const syncResult = await syncKnowledgeBase();

      if (syncResult.success && syncResult.jobId) {
        setSyncJobId(syncResult.jobId);
        setUploadStatus({
          type: "success",
          message: "File uploaded successfully!",
        });
      } else {
        setUploadStatus({
          type: "success",
          message: "File uploaded, but sync failed. Please sync manually.",
        });
      }

      setFile(null);
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: "An unexpected error occurred",
      });
    } finally {
      setUploading(false);
      setSyncing(false);
    }
  };

  const handleSyncComplete = useCallback(() => {
    setSyncJobId(null);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Upload PDF to Knowledge Base
      </h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select PDF File
          </label>
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            disabled={uploading || syncing}
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!file || uploading || syncing}
          className="w-full"
        >
          {uploading || syncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploading ? "Uploading..." : "Syncing..."}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload & Sync
            </>
          )}
        </Button>

        {uploadStatus.type && (
          <div
            className={clsx(
              "flex items-start gap-2 p-3 rounded-md text-sm",
              uploadStatus.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            )}
          >
            {uploadStatus.type === "success" ? (
              <CheckCircle className="h-5 w-5 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0" />
            )}
            <p>{uploadStatus.message}</p>
          </div>
        )}

        {syncJobId && (
          <SyncStatusTracker jobId={syncJobId} onComplete={handleSyncComplete} />
        )}
      </form>
    </div>
  );
}