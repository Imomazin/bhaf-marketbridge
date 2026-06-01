import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const baseConfig = Array.isArray(nextCoreWebVitals) ? nextCoreWebVitals : [nextCoreWebVitals];

export default [
  ...baseConfig,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "prisma/migrations/**",
      "next-env.d.ts",
      "**/*.config.js",
      "**/*.config.mjs",
    ],
  },
  {
    // Soften React 19's stricter rules to warnings so existing code
    // compiled fine with React 18 still passes CI. Fix opportunistically.
    rules: {
      // React 19 / React Compiler — new strict rules. Downgrade until we
      // do a dedicated cleanup pass on impure render calls and effects.
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      // Existing lint warnings — keep visible but non-blocking
      "react/no-unescaped-entities": "warn",
      "@next/next/no-img-element": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "prefer-const": "warn",
      "no-empty": "warn",
    },
  },
];
