/**
 * Ships package files to dist folder.
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fse = require("fs-extra");

const packagePath = process.cwd();
const distPath = path.join(packagePath, "./dist");

async function ship(file, verbose) {
    const sourcePath = path.resolve(packagePath, file);
    const targetPath = path.resolve(distPath, path.basename(file));

    await fse.copy(sourcePath, targetPath);

    if (verbose) {
        console.log(`Copied ${sourcePath} to ${targetPath}`);
    }
}

async function createPackageFile(verbose) {
    const packageData = JSON.parse(await fse.readFile(path.resolve(packagePath, "./package.json"), "utf8"));

    delete packageData.devDependencies;
    delete packageData.scripts;

    const targetPath = path.resolve(distPath, "./package.json");

    await fse.writeFile(targetPath, JSON.stringify(packageData, null, 2), "utf8");

    if (verbose) {
        console.log(`Created package.json in ${targetPath}`);
    }
}

async function shipper(verbose) {
    await createPackageFile(verbose);

    await Promise.all(["./README.md", "./CHANGELOG.md", path.resolve(__dirname, "../LICENSE")].map((file) => ship(file, verbose)));
}

module.exports = {
    shipper,
};
