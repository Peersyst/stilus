/**
 * Prepares a bundle.
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const childProcess = require("child_process");
const path = require("path");
const { promisify } = require("util");

const exec = promisify(childProcess.exec);

const bundles = ["node", "esm"];
const packagePath = process.cwd();
const babelConfigPath = path.resolve(packagePath, "./babel.config.js");
const srcDir = path.resolve("./src");
const extensions = [".js", ".ts", ".tsx"];
const ignore = ["**/*.test.js", "**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx", "**/*.d.ts"];

async function bundler(bundle, outDir, largeFiles, verbose) {
    if (!bundles.includes(bundle)) {
        throw new Error(`Invalid bundle: ${bundle}`);
    }

    const env = {
        NODE_ENV: "production",
        BABEL_ENV: bundle,
        BUILD_VERBOSE: verbose,
    };

    const bundleOutDir = path.resolve(outDir, bundle === "node" ? "./node" : "./esm");

    const babelArgs = [
        "--config-file",
        babelConfigPath,
        "--extensions",
        `"${extensions.join(",")}"`,
        srcDir,
        "--out-dir",
        bundleOutDir,
        "--ignore",
        `"${ignore.join('","')}"`,
    ];
    if (largeFiles) {
        babelArgs.push("--compact false");
    }

    const command = ["yarn babel", ...babelArgs].join(" ");

    if (verbose) {
        console.log(`Running "${command}" with ${JSON.stringify(env)}`);
    }

    const { stderr, stdout } = await exec(command, { env: { ...process.env, ...env } });
    if (stderr) {
        throw new Error(`Command: "${command}" failed with \n${stderr}`);
    }

    if (verbose) {
        console.log(stdout);
    }
}

module.exports = {
    bundler,
};
