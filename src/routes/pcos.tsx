import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/pcos")({
  component: PcosRedirect,
});

function PcosRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("petal:mode", "pcos");
    }
    navigate({ to: "/", replace: true });
  }, [navigate]);
  return null;
}
