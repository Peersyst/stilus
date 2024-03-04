/**
 * Builds all package contents and bundles.
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const yargs = require("yargs");

const { bundler } = require("./bundler");
const { compiler } = require("./compiler");
const { shipper } = require("./shipper");

const bundles = ["node", "esm"];

async function builder(argv) {
    const { largeFiles, outDir, verbose } = argv;

    await Promise.all(bundles.map((bundle) => bundler(bundle, outDir, largeFiles, verbose)));

    await compiler(verbose);

    await shipper(verbose);
}

yargs
    .command({
        command: "$0",
        description: "Build package",
        builder: (command) => {
            return command
                .option("largeFiles", {
                    type: "boolean",
                    default: false,
                    describe: "Set to `true` if you know you are transpiling large files.",
                })
                .option("out-dir", { default: "./dist", type: "string" })
                .option("verbose", { type: "boolean" });
        },
        handler: builder,
    })
    .help()
    .strict(true)
    .version(false)
    .parse();
