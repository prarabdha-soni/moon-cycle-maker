import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/conceive")({
  component: ConceiveRedirect,
});

function ConceiveRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("petal:mode", "conceive");
    }
    navigate({ to: "/", replace: true });
  }, [navigate]);
  return null;
}
