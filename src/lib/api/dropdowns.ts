import { apiClient } from "../apiClient";
import type { Language, Voice, Prompt, Model } from "@/types/agent";

export const dropdowns = {
  getLanguages: () => apiClient.get<Language[]>("/languages"),

  getVoices: () => apiClient.get<Voice[]>("/voices"),

  getPrompts: () => apiClient.get<Prompt[]>("/prompts"),

  getModels: () => apiClient.get<Model[]>("/models"),
};
