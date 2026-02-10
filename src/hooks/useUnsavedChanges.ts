import { useEffect, useCallback } from "react";

export function useUnsavedChanges(hasUnsavedChanges: boolean) {
  // Warn before closing/refreshing the browser tab
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Return a function to check before navigation
  const confirmNavigation = useCallback(() => {
    if (hasUnsavedChanges) {
      return window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );
    }
    return true;
  }, [hasUnsavedChanges]);

  return { confirmNavigation };
}
