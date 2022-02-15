import { themeWindow, dailyUpdate } from "./window";

const main = () => {
    ui.registerMenuItem("Ride Painter", () => themeWindow.open())
    context.subscribe('interval.day', () => {
        dailyUpdate();
    });

    dailyUpdate();

}
export default main
