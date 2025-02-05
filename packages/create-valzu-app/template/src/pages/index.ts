// packages/create-valzu-app/template/src/pages/index.ts
import { createElement } from "valzu-core";

export default function Home() {
  return createElement("div", { class: "home" }, "Welcome to Valzu.js!");
}
