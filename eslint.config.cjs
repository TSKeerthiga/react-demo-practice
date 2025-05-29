module.exports = [
    {
        languageOptions: {
            globals: {
                browser: true,
                es6: true
            },
            parser: require('@typescript-eslint/parser'), // Corrected parser configuration
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        plugins: {
            react: require('eslint-plugin-react'),
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
        },
        rules: {
            'space-before-function-paren': ['error', 'never'],
            'quotes': ['error', 'single'],
            'object-curly-spacing': ['error', 'never'],
            'semi': ['error', 'always']
        },
        settings: {
            react: {
                version: 'detect'
            }
        }
    }
];
