/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
    plugins: ["prettier-plugin-tailwindcss"],

    tabWidth: 4,
    semi: true,
    bracketSpacing: true,
    arrowParens: "always",
    printWidth: 120,
};

export default config;
