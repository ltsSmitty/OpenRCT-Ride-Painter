import { FeatureController } from './controllers/Controllers';
/* eslint-disable guard-for-in */
import { themeWindow, dailyUpdate } from "./window";
import { debug } from "./helpers/logger";
import StateWatcher from "./services/stateWatcher";

const main = () =>
{
    const featureController = new FeatureController
    featureController.load()
    const watcher = new StateWatcher(featureController);
    const window = themeWindow(featureController);
    ui.registerMenuItem("Ride Painter", () => window.open())
    // context.subscribe('interval.day', () =>
    // {
        // todo reimplement
        // dailyUpdate(featureController);
    // });
    // // initPluginSettings();
    // dailyUpdate();

    //
}

export default main
