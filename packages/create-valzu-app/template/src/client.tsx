import { hydrate } from "valzu-core/dist/utils";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#app");
  if (container) {
    hydrate(container as HTMLElement);
  }
});
