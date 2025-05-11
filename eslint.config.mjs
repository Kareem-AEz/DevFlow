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
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		plugins: {
			"simple-import-sort": simpleImportSort,
			"unused-imports": unusedImports,
		},

		rules: {
			"@typescript-eslint/no-unused-vars": "warn",
			"simple-import-sort/imports": [
				"warn",
				{
					groups: [
						// Node.js builtins
						["^node:", "^fs", "^path", "^url", "^os", "^crypto"],

						// Framework core
						["^react", "^next"],

						// Other external packages
						["^@?\\w"],

						// Internal logic (e.g., utils, hooks, auth)
						["^@/auth", "^@/lib", "^@/utils", "^@/hooks"],

						// Internal UI components
						["^@/components", "^@/ui"],

						// Relative parent imports
						["^\\.\\.(?!/?$)", "^\\.\\./?$"],

						// Relative sibling or current directory
						["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],

						// Style files
						["^.+\\.s?css$"],
					],
				},
			],
			"simple-import-sort/exports": "warn",
			"no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
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
