import { apiClient } from "../apiClient";
import type { UploadUrlResponse, AttachmentResponse } from "@/types/agent";

export const uploads = {
  getUploadUrl: () =>
    apiClient.post<UploadUrlResponse>("/attachments/upload-url"),

  upload: (
    signedUrl: string,
    file: File,
    onProgress?: (percent: number) => void,
  ) => apiClient.uploadFile(signedUrl, file, onProgress),

  register: (data: {
    key: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }) => apiClient.post<AttachmentResponse>("/attachments", data),

  complete: async (
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<AttachmentResponse> => {
    // Step 1: Get upload URL
    const { key, signedUrl } = await uploads.getUploadUrl();

    // Step 2: Upload file
    await uploads.upload(signedUrl, file, onProgress);

    // Step 3: Register attachment
    return uploads.register({
      key,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || "application/octet-stream",
    });
  },
};
