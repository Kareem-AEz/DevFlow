import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      ignorePatterns: ["components/ui/**"],
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            ["^node:", "^fs", "^path", "^url", "^os", "^crypto"], // Node.js builtins
            ["^react"], // React core
            ["^next/font", "^next(?!/font)", "^next-themes"], // Next.js core with fonts first
            ["^@?\\w"], // Other external packages
            ["^@/auth", "^@/lib", "^@/utils", "^@/hooks"], // Internal logic
            ["^@/components", "^@/ui"], // Internal UI components
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"], // Relative parent imports
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"], // Relative sibling or current directory
            ["^.+\\.s?css$"], // Style files
          ],
        },
      ],
      "simple-import-sort/exports": "warn",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default eslintConfig;
