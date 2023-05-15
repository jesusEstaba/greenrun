module.exports = {
    root: true,
    env: {
        "es2021": true,
        "node": true
    },
    extends: [
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    parserOptions: {
        project: './tsconfig.json',
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    rules: {
        "react/jsx-filename-extension": 0,
        "import/extensions": 0,
        "import/no-extraneous-dependencies": 0,
        "@typescript-eslint/indent": ["error", 4],
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/lines-between-class-members": "off",
    },
    overrides: [
        {
            files: [
                "./src/modules/core/UseCase.ts"
            ],
            rules: {
                "@typescript-eslint/no-explicit-any": "off"
            }
        },
        {
            files: ["*.spec.ts"],
            rules: {
                "@typescript-eslint/unbound-method": "off"
            }
        },
        {
            files: ["**/routes.ts"],
            rules: {
                "@typescript-eslint/no-unsafe-assignment": "off"
            }
        }
    ]
}
