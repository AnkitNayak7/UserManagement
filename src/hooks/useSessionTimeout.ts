import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SESSION_CONFIG, ActivityEvent } from "../config/session";

export const useSessionTimeout = () => {
  const navigate = useNavigate();

  const clearSession = useCallback(() => {
    localStorage.removeItem("sessionId");
    localStorage.removeItem("sessionExpiry");
    navigate("/login");
  }, [navigate]);

  const checkSession = useCallback(() => {
    const expiry = localStorage.getItem("sessionExpiry");
    if (!expiry || Date.now() > parseInt(expiry)) {
      clearSession();
    }
  }, [clearSession]);

  const extendSession = useCallback(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      localStorage.setItem(
        "sessionExpiry",
        (Date.now() + SESSION_CONFIG.TIMEOUT_DURATION).toString(),
      );
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(checkSession, SESSION_CONFIG.CHECK_INTERVAL);

    const handleActivity = () => {
      extendSession();
    };

    // Add event listeners for user activity
    SESSION_CONFIG.ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Initial session check
    checkSession();

    return () => {
      clearInterval(interval);
      SESSION_CONFIG.ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [checkSession, extendSession]);

  return {
    extendSession,
    clearSession,
  };
};
