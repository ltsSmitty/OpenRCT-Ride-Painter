import { themeWindow, dailyUpdate, initPluginSettings } from "./window";

const main = () => {
    ui.registerMenuItem("Ride Painter", () => themeWindow.open())
    context.subscribe('interval.day', () => {
        dailyUpdate();
    });
    initPluginSettings();
    dailyUpdate();

}
export default main
