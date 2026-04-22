import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import {
  HeadProvider,
  createHeadContext,
  renderHeadToString,
} from "@landrr/core";
import App from "./App";
import * as HomePage from "./pages/Home";
import * as AboutPage from "./pages/About";

export const routes = {
  "/": HomePage,
  "/about": AboutPage,
};

export function render(url: string, initialRouteData: Record<string, Record<string, unknown>> = {}) {
  const headContext = createHeadContext();

  const html = renderToString(
    <StrictMode>
      <HeadProvider value={headContext}>
        <StaticRouter location={url}>
          <App initialRouteData={initialRouteData} />
        </StaticRouter>
      </HeadProvider>
    </StrictMode>
  );

  const head = renderHeadToString(headContext.heads);

  return { html, head };
}
