import { useState, useCallback } from "react";
import { agents } from "@/lib/api";
import type { AgentData, Agent } from "@/types/agent";
import { useToast } from "./useToast";

export function useAgentSave() {
  const [agentId, setAgentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const saveAgent = useCallback(
    async (data: AgentData) => {
      setIsSaving(true);
      setError(null);

      try {
        let savedAgent: Agent;

        if (agentId) {
          savedAgent = await agents.update(agentId, data);
          toast.success("Agent updated successfully!");
        } else {
          savedAgent = await agents.create(data);
          setAgentId(savedAgent.id);
          toast.success("Agent created successfully!");
        }

        return savedAgent;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to save agent";
        setError(errorMsg);
        toast.error(errorMsg);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [agentId, toast],
  );

  return {
    agentId,
    saveAgent,
    isSaving,
    error,
  };
}
