import React from "react";
import type { ErrorInfo, ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient } from "@tanstack/react-query";
import "./styles.css";

/** Catches unhandled render errors so a broken page doesn't crash the whole app */
class AppErrorBoundary extends React.Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Petal error boundary caught:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 bg-background px-8 text-center">
          <p className="text-4xl">🌸</p>
          <h1 className="font-display text-[22px] font-semibold text-foreground">
            Something went wrong
          </h1>
          <p className="text-[14px] text-muted-foreground">
            Petal hit an unexpected error. Tap below to reload.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-2xl bg-period px-6 py-3 text-[14px] font-semibold text-white"
          >
            Reload app
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient },
  scrollRestoration: true,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppErrorBoundary>
        <RouterProvider router={router} />
      </AppErrorBoundary>
    </React.StrictMode>,
  );
}
