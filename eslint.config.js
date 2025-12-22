import kontentAiConfig from "@kontent-ai/eslint-config";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "node_modules", "playwright"]),
  {
    extends: [kontentAiConfig],
    files: ["src/**/*.ts", "src/**/*.tsx", "test-browser/**/*.ts", "test-components/**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.test.json"],
      },
    },
    rules: {
      "@typescript-eslint/promise-function-async": "off",
    },
  },
  // Disable unbound-method for test files (Playwright test functions are safe)
  {
    files: ["test-browser/**/*.ts", "test-components/**/*.tsx"],
    rules: {
      "@typescript-eslint/unbound-method": "off",
    },
  },
]);
