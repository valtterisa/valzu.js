// packages/create-valzu-app/template/src/client.tsx
import { hydrate } from "valzu-core";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#app");
  if (container) {
    hydrate(container as HTMLElement);
  }
});
