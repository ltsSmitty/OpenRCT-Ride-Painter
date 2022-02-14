import { themeWindow, dailyUpdate } from "./window2";

const main = () => {
    ui.registerMenuItem("Ride Paint Manager", () => themeWindow.open())
    context.subscribe('interval.day', () => {
        dailyUpdate();
    });

    dailyUpdate();

}
export default main
