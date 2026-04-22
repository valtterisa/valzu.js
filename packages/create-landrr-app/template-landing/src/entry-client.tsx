import "./styles.css";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

declare global {
  interface Window {
    __LANDRR_DATA__?: Record<string, Record<string, unknown>>;
  }
}

hydrateRoot(
  document.getElementById("app")!,
  <StrictMode>
    <BrowserRouter>
      <App initialRouteData={window.__LANDRR_DATA__ ?? {}} />
    </BrowserRouter>
  </StrictMode>
);
