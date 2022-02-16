import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import resolve from '@rollup/plugin-node-resolve';
import pkg from "./package.json";


// Environment variables
const build = process.env.BUILD || "development";
const isDev = (build === "development");

const output = (isDev)
	? `/Users/andrewpenman/Library/Application Support/OpenRCT2/plugin/RidePainter.js`
	: "./dist/RidePainter.js";


/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
	input: "./src/registerPlugin.ts",
	output: {
		file: output,
		format: "iife",
	},
	plugins: [
		replace({
			include: "./src/helpers/environment.ts",
			preventAssignment: true,
			values: {
				__PLUGIN_VERSION__: pkg.version,
				__BUILD_CONFIGURATION__: build
			}
		}),
		typescript(),
		terser({
			compress: {
				passes: 5
			},
			format: {
				comments: false,
				quote_style: 1,
				wrap_iife: true,
        // TODO change url to final.
				preamble: "// Get the latest version: https://github.com/thesm17/OpenRCT-Ride-Painter",
				beautify: isDev,
			},
			mangle: {
				properties: {
					regex: /^_/
				}
			},

			// Useful only for stacktraces:
			keep_fnames: isDev,
		}),
    resolve(),
	],
};
export default config;
