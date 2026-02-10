import { useState, useEffect } from "react";

interface Language {
  id: string;
  name: string;
  code: string;
}

interface Voice {
  id: string;
  name: string;
  tag: string;
  language: string;
}

interface Prompt {
  id: string;
  name: string;
  description: string;
}

interface Model {
  id: string;
  name: string;
  description: string;
}
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
        setDropdownsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const [langRes, voiceRes, promptRes, modelRes] = await Promise.all([
          fetch(`${baseUrl}/languages`),
          fetch(`${baseUrl}/voices`),
          fetch(`${baseUrl}/prompts`),
          fetch(`${baseUrl}/models`),
        ]);

        if (!langRes.ok || !voiceRes.ok || !promptRes.ok || !modelRes.ok) {
          throw new Error("Failed to load form data");
        }

        setLanguages(await langRes.json());
        setVoices(await voiceRes.json());
        setPrompts(await promptRes.json());
        setModels(await modelRes.json());
      } catch (err) {
        setDropdownsError(
          err instanceof Error ? err.message : "Something went wrong",
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
