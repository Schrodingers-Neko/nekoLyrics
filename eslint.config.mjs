import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        ignores: [
            "plugin/index.js",
            "SongStorage/**",
            "node_modules/**",
            "windows-bridge-src/**",
            "dist/**",
            "build/**",
            "log/**",
            "propertyInspector/utils/axios.js"
        ]
    },
    // Node.js files
    {
        files: ["plugin/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                ...globals.node,
                __nccwpck_require__: "readonly"
            }
        },
        rules: {
            "indent": ["error", 4, { "SwitchCase": 1 }],
            "quotes": ["error", "double"],
            "semi": ["error", "always"],
            "eqeqeq": ["error", "always"],
            "no-useless-escape": "error",
            "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }],
            "no-constant-condition": ["off"],
            "no-empty": ["off"],
            "no-prototype-builtins": ["off"]
        }
    },
    // Property Inspector (Browser) files
    {
        files: ["propertyInspector/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.jquery,
                "$settings": "readonly",
                "$websocket": "readonly",
                "$propEvent": "readonly",
                "$local": "readonly",
                "$back": "readonly",
                "$dom": "readonly",
                "$emit": "readonly"
            }
        },
        rules: {
            "indent": ["error", 4, { "SwitchCase": 1 }],
            "quotes": ["error", "double"],
            "semi": ["error", "always"],
            "no-unused-vars": ["warn"]
        }
    }
];
