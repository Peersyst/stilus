/**
 * Compiles types.
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const childProcess = require("child_process");
const { promisify } = require("util");
const path = require("path");
const fse = require("fs-extra");

const exec = promisify(childProcess.exec);

const packageRoot = process.cwd();
const tsconfigPath = path.join(packageRoot, "tsconfig.build.json");

async function compiler(verbose) {
    if (!fse.existsSync(tsconfigPath)) {
        throw new Error(`Unable to find a tsconfig.build.json in the package root: "${packageRoot}"`);
    }

    const command = ["yarn", "tsc", "-b", tsconfigPath].join(" ");

    const { stderr, stdout } = await exec(command);

    if (stderr) {
        throw new Error(`Command: "${command}" failed with \n${stderr}`);
    }

    if (verbose) {
        console.log(stdout);
    }
}

module.exports = {
    compiler,
};
