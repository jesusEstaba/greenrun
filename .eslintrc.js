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
        "@typescript-eslint/indent": ["error", 4]
    }
}
