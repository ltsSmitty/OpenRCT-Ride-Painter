import { Store, store } from "openrct2-flexui";
import BaseController from "./BaseController";
import { sharedStorageNamespace } from "../helpers/environment";
import { debug } from "../helpers/logger";

export default class SettingsController extends BaseController<string> {
    /**
     * Repaints selected rides every time period:
     * never, daily, weekly, monthly, annually
     */
    automaticPaintFrequency!: Store<number>;

    /**
     * Paint rides as soon as their built.
     * Enabling helps theme continuity feel
     */
    paintBrantNewRides!: Store<boolean>;

    /**
     * Toggles whether rides that have already been painted can be painted again.
     * Gives flexibility if you're manually theming rides/ride types
     */
    repaintExistingRides!: Store<boolean>;

    /**
     * Toggle whether to paint the supports according to the theme,
     * or to use natural (white, grey, black, brown) supports
     */
    naturalSupports!: Store<boolean>;

    lookupKeys;

    constructor() {
        super({ library: [] });
        this.setDefaults();
        this.lookupKeys = {
            automaticPaintFrequency: `${sharedStorageNamespace}.automaticPaintFrequency`,
            paintBrantNewRides: `${sharedStorageNamespace}.paintBrantNewRides`,
            repaintExistingRides: `${sharedStorageNamespace}.repaintExistingRides`,
            naturalSupports: `${sharedStorageNamespace}.naturalSupports`,
        };
        this.loadValuesFromStorage();
    }

    setDefaults() {
        this.automaticPaintFrequency = store<number>(0);
        this.paintBrantNewRides = store<boolean>(true);
        this.repaintExistingRides = store<boolean>(true);
        this.naturalSupports = store<boolean>(true);
    }

    override loadValuesFromStorage() {
        this.automaticPaintFrequency = store<number>(
            this.getValue("automaticPaintFrequency") as number
        );
        this.paintBrantNewRides = store<boolean>(
            this.getValue("paintBrantNewRides") as boolean
        );
        this.repaintExistingRides = store<boolean>(
            this.getValue("repaintExistingRides") as boolean
        );
        this.naturalSupports = store<boolean>(
            this.getValue("naturalSupports") as boolean
        );
    }

    getValue(value: keyof typeof this.lookupKeys) {
        return context.sharedStorage.get(
            this.lookupKeys[value],
            this[value].get()
        );
    }

    setValue<T>(key: keyof typeof this.lookupKeys, value: T) {
        context.sharedStorage.set(this.lookupKeys[key], value);
    }

    override debug() {
        debug(
            `Debugging SettingsController
            automaticPaintFrequency: ${this.getValue(
                "automaticPaintFrequency"
            )},
            paintBrandNewRides: ${this.getValue("paintBrantNewRides")},
            repaintExistingRides: ${this.getValue("repaintExistingRides")},
            naturalSupports: ${this.getValue("naturalSupports")}`
        );
    }

    /**
     * Subscribe to settings UI changes to update context.sharedStorage values
     */
    subToSettingsChange() {
        debug(`Subscribing to settings changes.`);
        this.automaticPaintFrequency.subscribe((freq) => {
            debug(
                `Updated setting in sharedStoreage: ${this.lookupKeys.automaticPaintFrequency}: ${freq}`
            );
            this.setValue("automaticPaintFrequency", freq);
        });
        this.paintBrantNewRides.subscribe((toggle) => {
            debug(
                `Updated setting in sharedStoreage: ${this.lookupKeys.paintBrantNewRides}: ${toggle}`
            );
            this.setValue("paintBrantNewRides", toggle);
        });
        this.repaintExistingRides.subscribe((toggle) => {
            debug(
                `Updated setting in sharedStoreage: ${this.lookupKeys.repaintExistingRides}: ${toggle}`
            );
            this.setValue("repaintExistingRides", toggle);
        });
        this.naturalSupports.subscribe((toggle) => {
            debug(
                `Updated settings in sharedStorage: ${this.lookupKeys.naturalSupports}: ${toggle}`
            );
            this.setValue("naturalSupports", toggle);
        });
    }

    /**
     * Design to be run in daily. Checks automaticPaintFrquency vs what day it is.
     * Returns true if rides should be repainted today
     */
    shouldAutomaticallyPaintToday(): boolean {
        // PAINT RIDES BASED ON AUTOMATIC PAINT FREQUENCY
        //  values: ["never", "daily", "weekly", "monthly", "yearly"],
        const paintFrequency = this.getValue("automaticPaintFrequency");
        // if set to never, return
        if (paintFrequency === 0) return false;

        // if set to annual, check that month = 0 and day = 1 before painting
        if (paintFrequency === 4 && date.month === 0 && date.day === 1) {
            // ColourChange.colourRides(featureController);
            return true;
        }
        // if set to monthly, check that day = 1 before painting
        if (paintFrequency === 3 && date.day === 1) {
            // ColourChange.colourRides(featureController);
            return true;
        }
        // if set to weekly, check if the day remainder is 1 (will change on the 1, 8, 15, 22, 29 of the month)
        if (paintFrequency === 2 && date.day % 7 === 1) {
            // ColourChange.colourRides(featureController);
            return true;
        }
        // if set to daily
        if (paintFrequency === 1) return true;
        // ColourChange.colourRides(featureController)
        return false;
    }
}
