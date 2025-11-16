export default {
  // Run ESLint and Prettier on all JS/TS-like files
  "**/*.{js,jsx,ts,tsx}": ["eslint --cache --fix", "prettier --write"],

  // Run Prettier on other common file types
  "**/*.{json,css,html,md}": ["prettier --write"],
};
