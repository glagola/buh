/** @type {import("prettier").Config} */
const config = {
    pluginSearchDirs: ['./node_modules'],
    plugins: [
        'prettier-plugin-tailwindcss',
        '@trivago/prettier-plugin-sort-imports',
    ],
    tabWidth: 4,
    useTabs: false,
    semi: true,
    quoteProps: 'as-needed',
    jsxSingleQuote: true,
    singleQuote: true,
    trailingComma: 'all',
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'always',
    singleAttributePerLine: true,
    printWidth: 120,

    importOrder: ['<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
    importOrderSeparation: true,
};

module.exports = config;
