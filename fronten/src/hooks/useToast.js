import { useState, useCallback } from "react";

export default function useToast() {
  const [toast, setToast] = useState({ message: "", type: "info" });

  const showToast = useCallback((message, type = "info") => {
    setToast({ message: "", type }); // reset so repeated identical messages retrigger animation
    setTimeout(() => setToast({ message, type }), 10);
  }, []);

  const hideToast = useCallback(() => {
    setToast((t) => ({ ...t, message: "" }));
  }, []);

  return { toast, showToast, hideToast };
}