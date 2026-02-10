import { useState } from "react";
import { api } from "@/lib/api";
import type { TestCallData } from "@/types/agent";
import { toast } from "sonner";

export function useTestCall() {
  const [isTesting, setIsTesting] = useState(false);

  const startTestCall = async (agentId: string, data: TestCallData) => {
    try {
      setIsTesting(true);
      const result = await api.testCall(agentId, data);
      toast.success("Test call initiated successfully!", {
        description: `Call ID: ${result.callId}`,
      });
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
