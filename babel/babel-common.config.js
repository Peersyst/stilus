module.exports = function (api) {
    const useESM = api.env("esm");

    return {
        assumptions: {
            noDocumentAll: true,
        },
        presets: [
            [
                "@babel/preset-env",
                {
                    bugfixes: true,
                    modules: useESM ? false : "commonjs",
                    shippedProposals: true,
                },
            ],
            "@babel/preset-typescript",
        ],
        plugins: [["@babel/plugin-transform-runtime", { useESModules: useESM }]],
    };
};
