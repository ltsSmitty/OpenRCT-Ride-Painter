import { themeWindow, dailyUpdate, initPluginSettings } from "./window";
import StateWatcher from "./services/stateWatcher";

const main = () =>
{
    const watcher = new StateWatcher();
    ui.registerMenuItem("Ride Painter", () => themeWindow.open())
    context.subscribe('interval.day', () =>
{
        dailyUpdate();
    });
    initPluginSettings();
    dailyUpdate();

    //
}
export default main
