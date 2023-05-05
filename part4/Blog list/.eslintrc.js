module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: "airbnb-base",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    quotes: ["error", "double"],
    "linebreak-style": ["error", "windows"],
    semi: ["error", "always"],
    "no-console": 0,
    indent: 0,
    "no-underscore-dangle": 0,
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
};
