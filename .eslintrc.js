module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: [
            './apps/property-management-api/tsconfig.json',
            './apps/analysis-api/tsconfig.json'
        ],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'plugin:@typescript-eslint/recommended',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        'indent': ['error', 4],
        'comma-spacing': 'off',
        '@typescript-eslint/comma-spacing': ['error', {
            'before': false,
            'after': true
        }],
        "quotes": [1, "single"],
        "@typescript-eslint/quotes": [ 1, "single", { "allowTemplateLiterals": true } ],
        "object-curly-spacing": ["error", "always", { "objectsInObjects": false }],
        "newline-before-return": "error",
        "no-console": ["error"],
        "semi": "off",
        "@typescript-eslint/semi": "error",
        "no-trailing-spaces": "error",
        "space-after-keywords": "off",
        "keyword-spacing": [2, {"before": true, "after": true}],
        "@typescript-eslint/no-explicit-any": "off",
        "space-before-blocks": "error",
        "space-before-function-paren": ["error", {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "always"
        }],
        "arrow-spacing": ["error", { "before": true, "after": true }]
    },
};
