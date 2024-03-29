import FeatureController from "./controllers/FeatureController";
import { themeWindow } from "./window";
import StateWatcher from "./services/stateWatcher";

const main = () => {
  const featureController = new FeatureController();
  featureController.load();

  const watcher = new StateWatcher(featureController);
  const window = themeWindow(featureController);
  ui.registerMenuItem("Ride Painter", () => window.open());
};

export default main;
