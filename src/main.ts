import { FeatureController } from './controllers/Controllers';
/* eslint-disable guard-for-in */
import { themeWindow, dailyUpdate } from "./window";
import model from "./model";
import { debug } from "./helpers/logger";
import StateWatcher from "./services/stateWatcher";

// const loadValuesFromStorage = (tc: ThemeController) =>
// {
//     debug(`Loading themeController`)
//     const loadedTheme = context.getParkStorage().get(("RidePainter.themeModel")) as {[keys:string]:any}[];
//     debug(`loadedTheme from parkStorage: ${JSON.stringify(loadedTheme)}`)
//     if (!loadedTheme) return
//     tc.applyValuesFromSave(loadedTheme)
//     debug(`loaded values. checking theme values`)
//     tc.debug()
// }

const main = () =>
{
    const featureController = new FeatureController
    featureController.load()
    const watcher = new StateWatcher(featureController);
    const window = themeWindow(featureController);
    ui.registerMenuItem("Ride Painter", () => window.open())
    // context.subscribe('interval.day', () =>
    // {
        // dailyUpdate(featureController);
    // });
    // // initPluginSettings();
    // dailyUpdate();

    //
}

export default main



export const debugModel = () =>
{
    debug(`<debugModel> model:`)
    let str ="";
    Object.keys(model).forEach(key =>
        {
            str += (`\n\t-${key} length: ${Object.keys(key).length}`)
            Object.keys(key).forEach(k=>
                {
                    str+=(`\n\tk: ${k}`)
                })
        })
    debug(str)
}
