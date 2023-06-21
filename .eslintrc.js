require("@rushstack/eslint-config/patch/modern-module-resolution")

module.exports = {
  extends: [
    "@rushstack/eslint-config/profile/node",
    "@rushstack/eslint-config/mixins/friendly-locals",
    "@nodesuite/eslint-config"
  ],
  overrides: [
    {
      files: ["src/**/*.ts"],
      rules: {
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/typedef": "off"
      }
    }
  ]
}
