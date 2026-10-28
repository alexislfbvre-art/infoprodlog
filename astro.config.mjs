// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { site } from "./src/config.ts";

// Tant que le domaine n'est pas renseigné, on utilise une URL neutre pour que le build passe.
const siteUrl = site.url.includes("[") ? "https://example.com" : site.url;

export default defineConfig({
  site: siteUrl,
  output: "static",
  trailingSlash: "never",
  build: { format: "file", inlineStylesheets: "always" },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/merci") && !page.includes("/404"),
    }),
  ],
});
