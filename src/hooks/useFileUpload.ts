import { useState, useCallback } from "react";
import { uploads } from "@/lib/api";
import type { UploadedFile } from "@/types/agent";

const ACCEPTED_TYPES = [
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
  ".csv",
  ".xlsx",
  ".xls",
];

export function useFileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadFile = useCallback(async (file: File, index: number) => {
    try {
      setUploadedFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: "uploading" as const } : f,
        ),
      );

      // Step 1: Get upload URL
      const { key, signedUrl } = await uploads.getUploadUrl();

      // Step 2: Upload file with progress tracking
      await uploads.upload(signedUrl, file, (progress) => {
        setUploadedFiles((prev) =>
          prev.map((f, i) => (i === index ? { ...f, progress } : f)),
        );
      });

      // Step 3: Register attachment
      const attachment = await uploads.register({
        key,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
      });

      setUploadedFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: "completed" as const,
                key,
                attachmentId: attachment.id,
              }
            : f,
        ),
      );
    } catch (error) {
      setUploadedFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: "error" as const,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f,
        ),
      );
    }
  }, []);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newFiles: UploadedFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = "." + file.name.split(".").pop()?.toLowerCase();
        if (ACCEPTED_TYPES.includes(ext)) {
          newFiles.push({
            name: file.name,
            size: file.size,
            file,
            status: "pending",
          });
        }
      }

      setUploadedFiles((prev) => {
        const updated = [...prev, ...newFiles];

        newFiles.forEach((_, idx) => {
          const actualIndex = prev.length + idx;
          uploadFile(updated[actualIndex].file, actualIndex);
        });

        return updated;
      });
    },
    [uploadFile],
  );

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const getAttachmentIds = useCallback(() => {
    return uploadedFiles
      .filter((f) => f.status === "completed" && f.attachmentId)
      .map((f) => f.attachmentId!);
  }, [uploadedFiles]);

  return {
    uploadedFiles,
    isDragging,
    handleFiles,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    getAttachmentIds,
    acceptedTypes: ACCEPTED_TYPES,
  };
}
