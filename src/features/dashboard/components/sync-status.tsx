"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { getSyncStatus } from "../actions/sync-status";

interface SyncStatusTrackerProps {
  jobId: string;
  onComplete?: () => void;
}

export function SyncStatusTracker({ jobId, onComplete }: SyncStatusTrackerProps) {
  const [status, setStatus] = useState<string>("STARTING");
  const [error, setError] = useState<string | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!jobId) return;

    let isMounted = true;
    let interval: NodeJS.Timeout;

    const checkStatus = async () => {
      if (!isMounted) return;

      const result = await getSyncStatus(jobId);

      if (!isMounted) return;

      if (result.success && result.status) {
        setStatus(result.status);

        if (result.status === "COMPLETE" && onCompleteRef.current) {
          onCompleteRef.current();
        } else if (result.status === "FAILED") {
          setError("Sync failed");
        }
      } else {
        setError(result.error || "Failed to check status");
      }
    };

    checkStatus();

    interval = setInterval(() => {
      if (status === "COMPLETE" || status === "FAILED") {
        clearInterval(interval);
        return;
      }
      checkStatus();
    }, 3000);

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [jobId]);

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <XCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    );
  }

  if (status === "COMPLETE") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span>Synced successfully</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-blue-600">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Syncing knowledge base...</span>
    </div>
  );
}