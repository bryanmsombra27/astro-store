// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

import db from "@astrojs/db";
import auth from "auth-astro";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  output: "server",
  adapter: netlify(),
  integrations: [db(), auth()],
});
