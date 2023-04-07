/** @type {import("prettier").Config} */
const config = {
    plugins: [require.resolve('prettier-plugin-tailwindcss')],
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
};

module.exports = config;
