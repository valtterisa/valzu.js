import { element } from "valzu-core/dist/utils";

export default function WelcomePage() {
  return element(
    "div",
    {},
    element("h1", {}, "🚀 Welcome to Valzu.js!"),
    element("p", {}, "Your full-stack framework is ready to go."),
    element("p", {}, "Edit components/WelcomePage.ts to modify this page."),
    element(
      "a",
      { href: "https://github.com/valtterisa/valzu.js", target: "_blank" },
      "📖 Read the Docs"
    ),
    element("a", { href: "/about", target: "_self" }, "📖 About")
  );
}
