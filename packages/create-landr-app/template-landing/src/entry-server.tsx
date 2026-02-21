import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import {
  HeadProvider,
  createHeadContext,
  renderHeadToString,
} from "@landr/core";
import App from "./App";

export function render(url: string) {
  const headContext = createHeadContext();

  const html = renderToString(
    <StrictMode>
      <HeadProvider value={headContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadProvider>
    </StrictMode>
  );

  const head = renderHeadToString(headContext.heads);

  return { html, head };
}
