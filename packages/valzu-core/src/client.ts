// Client-side utilities for Valzu.js React apps
import { hydrateRoot } from "react-dom/client";
import type { ReactNode } from "react";

/**
 * Hydrate a React app on the client side
 * @param App - The root React component
 * @param container - The DOM element to hydrate (defaults to #app)
 */
export function hydrateApp(App: ReactNode, container?: HTMLElement | null) {
  const root = container || document.getElementById("app");
  if (root) {
    hydrateRoot(root, App);
  } else {
    console.error("Valzu: Could not find container element for hydration");
  }
}

// Re-export hydrate for backward compatibility
export { hydrate } from "./utils";
