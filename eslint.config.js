import { defineConfig } from "eslint.config.js";
import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      indent: ["error", 2],
      "linebreak-style": ["error", "Windows"],
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
  },
  pluginJs.configs.recommended,
];