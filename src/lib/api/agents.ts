import { apiClient } from "../apiClient";
import type {
  AgentData,
  Agent,
  TestCallData,
  TestCallResponse,
} from "@/types/agent";

export const agents = {
  create: (data: AgentData) => apiClient.post<Agent>("/agents", data),

  update: (id: string, data: AgentData) =>
    apiClient.put<Agent>(`/agents/${id}`, data),

  testCall: (id: string, data: TestCallData) =>
    apiClient.post<TestCallResponse>(`/agents/${id}/test-call`, data),
};
