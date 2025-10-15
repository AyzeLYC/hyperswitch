let package_loader = false; /* false if NodeJS uses CommonJS, true if NodeJS uses ECMAScript */

try {

  require.main;
  
} catch(err) {

  package_loader = true;
  
};

var dependancies = [];

if (!package_loader) {

  let pluginJs = require("@eslint/js"),
      eslintConfigPrettier = require("eslint-config-prettier"),
      pluginCypress = require("eslint-plugin-cypress/flat"),
      eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended"),
      globals = require("globals"),
      tseslint = require("typescript-eslint");

  dependancies["pluginJs"] = pluginJs;
  dependancies["eslintConfigPrettier"] = eslintConfigPrettier;
  dependancies["pluginCypress"] = pluginCypress;
  dependanciees["eslintPluginPrettierRecommended"] = eslintPluginPrettierRecommended;
  dependancies["globals"] = globals;
  dependancies["tseslint"] = tseslint;
  
};
if (package_loader) {

  import pluginJs from "@eslint/js";
  import eslintConfigPrettier from "eslint-config-prettier";
  import pluginCypress from "eslint-plugin-cypress/flat";
  import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
  import globals from "globals";
  import tseslint from "typescript-eslint";

  dependancies["pluginJs"] = pluginJs;
  dependancies["eslintConfigPrettier"] = eslintConfigPrettier;
  dependancies["pluginCypress"] = pluginCypress;
  dependanciees["eslintPluginPrettierRecommended"] = eslintPluginPrettierRecommended;
  dependancies["globals"] = globals;
  dependancies["tseslint"] = tseslint;

};

/** @type {import('eslint').Linter.Config[]} */
export default [
  dependancies["pluginJs"].configs.recommended,
  dependancies["pluginCypress"].configs.recommended,
  dependancies["eslintPluginPrettierRecommended"],
  dependancies["eslintConfigPrettier"],
  ...dependancies["tseslint"].configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_.*$" },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    ignores: ["dist/**", "build/**", "node_modules/**"],
  },
  {
    languageOptions: {
      globals: {
        ...dependancies["globals"].browser,
        ...dependancies["globals"].node,
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_.*$" }],
      "no-undef": "error",
      "no-console": "warn",
      "prefer-const": "warn",
      "cypress/assertion-before-screenshot": "warn",
      "cypress/no-assigning-return-values": "warn",
      "@typescript-eslint/no-unused-expressions": "off",
      "cypress/no-force": "warn",
      "cypress/no-unnecessary-waiting": "warn",
      "cypress/no-async-tests": "error",
      "cypress/unsafe-to-chain-command": "warn",
      "prettier/prettier": "error",
    },
  }
];
