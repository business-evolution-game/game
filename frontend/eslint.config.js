import js from '@eslint/js'
import globals from 'globals'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import reactHooks from "@eslint/js";

export default tseslint.config({
    ignores: ['dist', "**/*tools.ts"]
}, {
    extends: [js.configs.recommended, ...tseslint.configs.recommended], files: ['src/**/*.{ts,tsx}'], languageOptions: {
        ecmaVersion: 2020, globals: globals.browser,
    }, plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
    }, rules: {
        ...reactHooks.configs.recommended.rules,
        "@typescript-eslint/no-namespace": "off",
        'react-refresh/only-export-components': ['warn', {allowConstantExport: true},],
        'indent': ['error', 4],
        "max-len": ["error", {"code": 180}],
        "no-console": ["warn", {"allow": ["warn", "error"]}]
    },
},{

})