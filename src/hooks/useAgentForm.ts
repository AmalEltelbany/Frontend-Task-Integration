import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Language, Voice, Prompt, Model } from "@/types/agent";

export function useAgentForm() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [dropdownsLoading, setDropdownsLoading] = useState(true);
  const [dropdownsError, setDropdownsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDropdowns() {
      try {
        const [langData, voiceData, promptData, modelData] = await Promise.all([
          api.getLanguages(),
          api.getVoices(),
          api.getPrompts(),
          api.getModels(),
        ]);

        setLanguages(langData);
        setVoices(voiceData);
        setPrompts(promptData);
        setModels(modelData);
      } catch (err) {
        setDropdownsError(
          err instanceof Error ? err.message : "Failed to load form data",
        );
      } finally {
        setDropdownsLoading(false);
      }
    }

    fetchDropdowns();
  }, []);

  return {
    languages,
    voices,
    prompts,
    models,
    dropdownsLoading,
    dropdownsError,
  };
}
