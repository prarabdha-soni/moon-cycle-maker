import React from "react";
import ReactDOM from "react-dom/client";
import { getRouter } from "./router";

const router = getRouter();

// Render the app
const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      {router.getMatch(router.state.resolvedPathname)?.routeId ? (
        router.getComponent()
      ) : (
        <router.RouterContext.Provider value={router}>
          <router.MatchRouter />
        </router.RouterContext.Provider>
      )}
    </React.StrictMode>
  );
}
