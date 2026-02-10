export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface Voice {
  id: string;
  name: string;
  tag: string;
  language: string;
}

export interface Prompt {
  id: string;
  name: string;
  description: string;
}

export interface Model {
  id: string;
  name: string;
  description: string;
}

export type UploadStatus = "pending" | "uploading" | "completed" | "error";

export interface UploadedFile {
  name: string;
  size: number;
  file: File;
  key?: string;
  attachmentId?: string;
  status: UploadStatus;
  error?: string;
  progress?: number;
}

export interface UploadUrlResponse {
  key: string;
  signedUrl: string;
}

export interface AttachmentResponse {
  id: string;
}

export interface AgentData {
  name: string;
  callType: string;
  language: string;
  voice: string;
  prompt: string;
  model: string;
  latency: number;
  speed: number;
  description?: string;
  callScript?: string;
  serviceDescription?: string;
  attachments?: string[];
  tools?: {
    allowHangUp: boolean;
    allowCallback: boolean;
    liveTransfer: boolean;
  };
}

export interface Agent extends AgentData {
  id: string;
}

export interface TestCallData {
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
}

export interface TestCallResponse {
  success: boolean;
  callId: string;
  agentId: string;
  status: string;
}
