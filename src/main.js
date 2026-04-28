import React from "react";
import { createRoot } from "react-dom/client";
import { html } from "./lib/html.js";
import { App } from "./app.js";

const root = createRoot(document.getElementById("app"));
root.render(html`<${React.StrictMode}><${App} /><//>`);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./public/sw.js").catch(() => {});
  });
}
