import { createElement } from "valzu-core/dist/utils";

export default function WelcomePage() {
  return createElement(
    "div",
    {},
    createElement("h1", {}, "🚀 Welcome to Valzu.js!"),
    createElement("p", {}, "Your full-stack framework is ready to go."),
    createElement(
      "p",
      {},
      "Edit components/WelcomePage.ts to modify this page."
    ),
    createElement(
      "a",
      { href: "https://github.com/valtterisa/valzu.js", target: "_blank" },
      "📖 Read the Docs"
    ),
    createElement("a", { href: "/about", target: "_self" }, "📖 About")
  );
}
