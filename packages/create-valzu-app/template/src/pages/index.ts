import { createElement } from "valzu-core/dist/utils";

export default function Home() {
  return createElement("div", { class: "home" }, "Welcome to Valzu.js!");
}
