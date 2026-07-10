import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Drop this into Home.jsx (or wherever you land after login/register)
// alongside the regular useToast hook, and call showToast with the result.
export default function useWelcomeToast(showToast) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Normal client-side navigation (email/password login or register)
    if (location.state?.welcome && location.state?.name) {
      showToast(`Welcome, ${location.state.name}! 👋`, "success");
      navigate(location.pathname, { replace: true, state: {} });
      return;
    }

    // Google login does a hard redirect, so it can't use router state
    const params = new URLSearchParams(location.search);
    if (params.get("welcome") === "1") {
      const storedName = sessionStorage.getItem("welcomeName");
      showToast(`Welcome, ${storedName || "back"}! 👋`, "success");
      sessionStorage.removeItem("welcomeName");
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.search]);
}