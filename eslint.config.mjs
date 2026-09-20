import tsParser from "@typescript-eslint/parser";

export default [{
  ignores: ["node_modules/**", ".next/**"],
  files: ["**/*.{js,jsx,ts,tsx}"],
  languageOptions: { parser: tsParser, parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } } },
  rules: { "no-constant-condition": "error", "no-unreachable": "error" }
}];
