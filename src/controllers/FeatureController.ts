import { debug } from "../helpers/logger";
import GroupingController from "./GroupingController";
import ModeController from "./ModeController";
import RideController from "./RideController";
import SettingsController from "./SettingsController";
import StationController from "./StationController";
import ThemeController from "./ThemeController";

export default class FeatureController
{
    groupingController: GroupingController;

    themeController: ThemeController;

    rideController: RideController;

    modeController: ModeController;

    stationController: StationController;

    settingsController: SettingsController;

    constructor()
    {
        this.groupingController = new GroupingController;
        this.themeController = new ThemeController;
        this.rideController = new RideController;
        this.modeController = new ModeController;
        this.stationController = new StationController
        this.settingsController = new SettingsController
    }

    save()
    {
        this.themeController.saveFeatures()
        this.rideController.saveFeatures()
        this.modeController.saveFeatures()
        this.stationController.saveFeatures()
        this.groupingController.saveFeatures()
    }

    load()
    {
        this.themeController.loadValuesFromStorage()
        this.groupingController.loadValuesFromStorage()
        this.rideController.loadValuesFromStorage()
        this.stationController.loadValuesFromStorage()
        this.modeController.loadValuesFromStorage()
        this.settingsController.loadValuesFromStorage()
        debug(`Theme, Grouping, Ride, Mode, Station, and Setting Loaded. Loading Complete.`)
    }

    // eslint-disable-next-line class-methods-use-this
    debug()
    {
        // todo implement something more here
        debug(`FeatureController debug: //nothing here! implement something`)
    }
}
