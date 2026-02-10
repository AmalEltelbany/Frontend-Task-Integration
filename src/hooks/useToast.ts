import { useCallback } from "react";
import { toast } from "sonner";

export function useToast() {
  const success = useCallback(
    (message: string, description?: string) => {
      if (description) {
        toast.success(message, { description });
      } else {
        toast.success(message);
      }
    },
    [],
  );

  const error = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const info = useCallback((message: string) => {
    toast.info(message);
  }, []);

  return {
    success,
    error,
    info,
  };
}
