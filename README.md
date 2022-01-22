# 🎢 Theme Editor

## Table of contents
  * [About](#about)
  * [Installation](#installation)
  * [Usage](#usage)
     * [How it works](#how-it-works)
     * [npm scripts](#npm-scripts)
  * [Releasing your mod](#releasing-your-mod)
  * [Notes](#notes)
  * [Useful links](#useful-links)

## About

This repository was created to serve as a template TypeScript mod repository for OpenRCT2.

## Installation

## Usage

### How it works

Your mod files live in `./src/` directory. That's the ones you will be writing code in.
Upon starting Nodemon server, it will start watching changes you make to files in `./src/`, and it will build them accordingly.

The entry point is `./src/registerPlugin.ts`. Any file, class, module you create in `./src/` needs to be imported to `registerPlugin.ts` one way or another.

Template uses [Terser](https://github.com/terser/terser) to minify your output mod bundle file and to resolve any dependencies.

### npm scripts

|script|function|
|--|--|
|`npm start`|starts Nodemon server that will be watching `./src/` directory for any changes you make to any files inside it|
|`npm run lint`|lints your `.ts` and `.js` files from `./src/` directory|
|`npm run build:dev`|compiles `registerPlugin.ts` and minifies it, then places it inside `PATH_TO_OPENRCT2/plugin/` as `MOD_NAME.js`|
|`npm run build`|runs `npm run lint` and if no linting errors are found, compiles `registerPlugin.ts` and minifies it, then places it inside `./dist/` folder as `MOD_NAME.js` - this is your final mod file|

## Releasing your mod

After running `npm run build` locally, `./dist/` directory will be created that will contain `MOD_NAME.js`.
It's up to you, if you want to edit `.gitignore` to actually include `./dist/` contents and push them to your remote or if you want to manually copy the contents of `./dist/` and publish them somewhere. However creating a GitHub release using contents of `./dist/` directory sounds like a cool idea. You would have your mod file available for download straight from the repo.
Don't forget to update `README.md` to reflect your mod and update version numbers for future releases.

## Notes

If you've added a new mod folder to `plugin`, and the OpenRCT2 didn't seem like it registered it (and you had a running park), just load the save/start a new park, so OpenRCT2 loads the mods again. Now when you overwrite them during development, there shouldn't be any problems with hot reload noticing file changes.

Don't touch `app.js`. Its existence makes Nodemon happy.

Nodemon is what watches your files for changes & fires off new dev builds for hot reloading.
Furthermore, it's used for resolving root directory of the project - that's used, for example, in init script.

Nodemon will watch all the files in `./src/` directory. You can also freely create classes, modules, import them in your mod files.
Sky's the limit :)

## Useful links

- [OpenRCT2 website](https://openrct2.io/)
- [OpenRCT2 on GitHub](https://github.com/OpenRCT2)
- [OpenRCT2 on Reddit](https://www.reddit.com/r/openrct2)
- [OpenRCT2 plugins website](https://openrct2plugins.org/)
- [OpenRCT2 example plugins repository](https://github.com/OpenRCT2/plugin-samples)
- [OpenRCT2 scripting guide](https://github.com/OpenRCT2/OpenRCT2/blob/develop/distribution/scripting.md)
- [OpenRCT2 hot reload feature presentation](https://www.youtube.com/watch?v=jmjWzEhmDjk)
