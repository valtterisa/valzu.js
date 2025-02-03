import { createElement } from "valzu-core";

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
      { href: "https://github.com/your-username/valzu.js", target: "_blank" },
      "📖 Read the Docs"
    )
  );
}
