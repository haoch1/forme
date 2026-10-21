import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
export default tseslint.config(
  {
    ignores: [
      "dist",
      "node_modules",
      "public",
      "template",
      "references",
      "src/components/ui",
      "*.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/incompatible-library": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            "antd",
            "react-icons",
            "@tabler/icons-react",
            "framer-motion",
            "gsap",
            "react-dnd",
            "@dnd-kit/core",
            "@dnd-kit/sortable",
            "@dnd-kit/utilities",
            "react-router",
            "react-router-dom",
            "axios",
            "swr",
            "redux",
            "@reduxjs/toolkit",
          ],
          patterns: [
            {
              group: ["antd/*", "@mui/*", "@chakra-ui/*", "react-icons/*"],
              message: "使用 AGENTS.md 中已固定的同职责技术栈。",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/router.tsx", "src/main.tsx"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  {
    files: ["scripts/**/*.mjs", "eslint.config.js"],
    languageOptions: { globals: globals.node },
  },
);
