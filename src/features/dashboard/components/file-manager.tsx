"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Trash2, 
  RefreshCw, 
  FileText, 
  Loader2, 
  File,
  FileImage,
  FileSpreadsheet,
  FileCode,
  FileJson
} from "lucide-react";
import { listUploadedPDFs, S3File } from "../actions/list-action";
import { deleteFileFromS3 } from "../actions/delete-action";
import { SyncStatusTracker } from "./sync-status";
import { Button } from "@/shared/components/ui/button";
import clsx from "clsx";

export function FileManager() {
  const [files, setFiles] = useState<S3File[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteSyncJobId, setDeleteSyncJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadFiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await listUploadedPDFs();

      if (result.success && result.files) {
        setFiles(result.files);
      } else {
        setError(result.error || "Failed to load files");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDelete = async (fileKey: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    setDeleting(fileKey);
    setError(null);
    setSuccess(null);
    setDeleteSyncJobId(null);

    try {
      const result = await deleteFileFromS3(fileKey);

      if (result.success) {
        setSuccess(`File deleted successfully!`);
        setFiles(files.filter((f) => f.key !== fileKey));
        
        if (result.syncJobId) {
          setDeleteSyncJobId(result.syncJobId);
        }
      } else {
        setError(result.error || "Failed to delete file");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteSyncComplete = useCallback(() => {
    setDeleteSyncJobId(null);
  }, []);

  const getFileIcon = (fileType: string) => {
    const iconProps = { className: "h-5 w-5 shrink-0" };
    
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText {...iconProps} className="h-5 w-5 text-red-600 shrink-0" />;
      case 'image':
        return <FileImage {...iconProps} className="h-5 w-5 text-purple-600 shrink-0" />;
      case 'excel':
      case 'csv':
        return <FileSpreadsheet {...iconProps} className="h-5 w-5 text-green-600 shrink-0" />;
      case 'json':
        return <FileJson {...iconProps} className="h-5 w-5 text-yellow-600 shrink-0" />;
      case 'javascript':
      case 'typescript':
      case 'html':
      case 'css':
        return <FileCode {...iconProps} className="h-5 w-5 text-blue-600 shrink-0" />;
      default:
        return <File {...iconProps} className="h-5 w-5 text-gray-600 shrink-0" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Uploaded Files ({files.length})
        </h2>
        <Button
          onClick={loadFiles}
          disabled={loading}
          variant="outline"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      {deleteSyncJobId && (
        <div className="mb-4">
          <SyncStatusTracker jobId={deleteSyncJobId} onComplete={handleDeleteSyncComplete} />
        </div>
      )}

      {loading && files.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12">
          <File className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No files uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.key}
              className={clsx(
                "flex items-center justify-between p-4 border rounded-lg transition-colors",
                deleting === file.key
                  ? "bg-gray-50 border-gray-300"
                  : "bg-white border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getFileIcon(file.fileType)}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">
                    {file.fileName}
                  </p>
                  <div className="flex gap-3 text-xs text-gray-500 mt-1">
                    <span className="px-2 py-0.5 bg-gray-100 rounded">
                      {file.fileType}
                    </span>
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{formatDate(file.lastModified)}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleDelete(file.key, file.fileName)}
                disabled={deleting === file.key}
              >
                {deleting === file.key ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}