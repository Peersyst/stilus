const babelCommon = require("./babel-common.config");

module.exports = function (api) {
    const babelCommonConfig = babelCommon(api);
    return {
        ...babelCommonConfig,
        presets: [...babelCommonConfig.presets, ["@babel/preset-react", { runtime: "automatic" }]],
    };
};
