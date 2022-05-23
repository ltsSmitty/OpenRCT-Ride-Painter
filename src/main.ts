import { FeatureController } from './controllers/BaseController';
import { themeWindow } from "./window";
import { debug } from "./helpers/logger";
import StateWatcher from "./services/stateWatcher";

const main = () =>
{
    const featureController = new FeatureController
    featureController.load()
    const watcher = new StateWatcher(featureController);
    const window = themeWindow(featureController);
    ui.registerMenuItem("Ride Painter", () => window.open())


}

export default main
