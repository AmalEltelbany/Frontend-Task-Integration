import { useState } from "react";
import { agents } from "@/lib/api";
import type { TestCallData } from "@/types/agent";
import { useToast } from "./useToast";

export function useTestCall() {
  const [isTesting, setIsTesting] = useState(false);
  const toast = useToast();

  const startTestCall = async (agentId: string, data: TestCallData) => {
    try {
      setIsTesting(true);
      const result = await agents.testCall(agentId, data);

      toast.success("Test call initiated successfully!", "You will receive a call shortly.");

      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Test call failed";
      toast.error(message);
      return null;
    } finally {
      setIsTesting(false);
    }
  };

  return {
    isTesting,
    startTestCall,
  };
}
