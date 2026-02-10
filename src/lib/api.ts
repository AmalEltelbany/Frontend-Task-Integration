import type {
  Language,
  Voice,
  Prompt,
  Model,
  UploadUrlResponse,
  AttachmentResponse,
  AgentData,
  Agent,
  TestCallData,
  TestCallResponse,
} from "@/types/agent";
import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`GET ${endpoint} failed: ${response.statusText}`);
  }

  return response.json();
}

async function post<T>(endpoint: string, data?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`POST ${endpoint} failed: ${response.statusText}`);
  }

  return response.json();
}

async function put<T>(endpoint: string, data?: unknown): Promise<T> {
  const isFile = data instanceof File || data instanceof Blob;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": isFile ? "application/octet-stream" : "application/json",
    },
    body: isFile ? data : data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`PUT ${endpoint} failed: ${response.statusText}`);
  }

  return response.json();
}

async function remove<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`DELETE ${endpoint} failed: ${response.statusText}`);
  }

  return response.json();
}

// ============================================
// Public API
// ============================================

export const api = {
  // Task 1: Dropdown data
  getLanguages: () => get<Language[]>("/languages"),
  getVoices: () => get<Voice[]>("/voices"),
  getPrompts: () => get<Prompt[]>("/prompts"),
  getModels: () => get<Model[]>("/models"),

  // Task 2: File upload (3-step process)
  getUploadUrl: () => post<UploadUrlResponse>("/attachments/upload-url"),

  uploadToSignedUrl: async (
    signedUrl: string,
    file: File,
    onProgress?: (progress: number) => void,
  ) => {
    const response = await axios.put(signedUrl, file, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress?.(percentCompleted);
        }
      },
    });

    return response.data;
  },

  createAttachment: (data: {
    key: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }) => post<AttachmentResponse>("/attachments", data),
  createAgent: (data: AgentData) => post<Agent>("/agents", data),

  updateAgent: (id: string, data: AgentData) =>
    put<Agent>(`/agents/${id}`, data),
  testCall: (agentId: string, data: TestCallData) =>
    post<TestCallResponse>(`/agents/${agentId}/test-call`, data),
};
