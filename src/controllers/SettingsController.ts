import { Store, store } from "openrct2-flexui";
import BaseController from "./BaseController";
import { sharedStorageNamespace } from "../helpers/environment";
import { debug } from "../helpers/logger";


export default class SettingsController extends BaseController<string>
{
    automaticPaintFrequency!: Store<number>

    paintBrantNewRides!: Store<boolean>

    repaintExistingRides!: Store<boolean>

    lookupKeys;

    constructor()
    {
        super({library:[]})
        this.setDefaults()
        this.lookupKeys = {
            automaticPaintFrequency: `${sharedStorageNamespace}.automaticPaintFrequency`,
            paintBrantNewRides: `${sharedStorageNamespace}.paintBrantNewRides`,
            repaintExistingRides: `${sharedStorageNamespace}.repaintExistingRides`
        }
        this.loadValuesFromStorage()
    }

    setDefaults()
    {
        this.automaticPaintFrequency = store<number>(0);
        this.paintBrantNewRides = store<boolean>(true);
        this.repaintExistingRides = store<boolean>(true);
    }

    override loadValuesFromStorage()
    {
        this.automaticPaintFrequency = store<number>(this.getAutomaticPaintFrequency())
        this.paintBrantNewRides = store<boolean>(this.getPaintBrandNewRides())
        this.repaintExistingRides = store<boolean>(this.getRepaintExistingRides())
    }

    /**
     * Repaints selected rides every time period
     * [never, daily, weekly, monthly, annually]
     */
    getAutomaticPaintFrequency(): number
    {
        return context.sharedStorage.get(this.lookupKeys.automaticPaintFrequency ,this.automaticPaintFrequency.get())
    }

    /**
     * Repaints selected rides every time period
     * [never, daily, weekly, monthly, annually]
     */
    setAutomaticPaintFrequency(v:number)
    {
        return context.sharedStorage.set(this.lookupKeys.automaticPaintFrequency,v);
    }

    /**
     * Paint rides as soon as their built.
     * Enabling helps theme continuity feel
     */
    getPaintBrandNewRides(): boolean
    {
        return context.sharedStorage.get(this.lookupKeys.paintBrantNewRides,this.paintBrantNewRides.get())
    }

    /**
     * Paint rides as soon as their built.
     * Enabling helps theme continuity feel
     */
    setPaintBrandNewRides(v:boolean)
    {
        return context.sharedStorage.set(this.lookupKeys.paintBrantNewRides,v);
    }

    /**
     * Toggles whether rides that have already been painted can be painted again.
     * Gives flexibility if you're manually theming rides/ride types
     */
    getRepaintExistingRides(): boolean
    {
        return context.sharedStorage.get(this.lookupKeys.repaintExistingRides, this.repaintExistingRides.get())
    }

    /**
     * Toggles whether rides that have already been painted can be painted again.
     * Gives flexibility if you're manually theming rides/ride types
     */
    setRepaintExistingRides(v:boolean)
    {
        return context.sharedStorage.set(this.lookupKeys.repaintExistingRides,v);
    }

    override debug()
    {
        debug(
            `Debugging SettingsController
            automaticPaintFrequency: ${this.getAutomaticPaintFrequency()},
            paintBrandNewRides: ${this.getPaintBrandNewRides()},
            repaintExistingRides: ${this.getRepaintExistingRides()}`
        )
    }

    /**
     * Subscribe to settings UI changes to update context.sharedStorage values
     */
    subToSettingsChange()
    {
        debug(`Subscribing to settings changes.`)
        this.automaticPaintFrequency.subscribe((freq) =>
        {
            // eslint-disable-next-line max-len
            debug(`Updated setting in sharedStoreage: ${this.lookupKeys.automaticPaintFrequency}: ${freq}`)
            this.setAutomaticPaintFrequency(freq)
        });
        this.paintBrantNewRides.subscribe((toggle) =>
        {
            debug(`Updated setting in sharedStoreage: ${this.lookupKeys.paintBrantNewRides}: ${toggle}`)
            this.setPaintBrandNewRides(toggle);
        });
        this.repaintExistingRides.subscribe((toggle) =>
        {
            debug(`Updated setting in sharedStoreage: ${this.lookupKeys.repaintExistingRides}: ${toggle}`)
            this.setRepaintExistingRides(toggle);
        })
    }


  /**
   * Design to be run in daily. Checks automaticPaintFrquency vs what day it is.
   * Returns true if rides should be repainted today
   */
     shouldAutomaticallyPaintToday(): boolean
    {
    // PAINT RIDES BASED ON AUTOMATIC PAINT FREQUENCY
    //  values: ["never", "daily", "weekly", "monthly", "yearly"],
    const paintFrequency = this.getAutomaticPaintFrequency();
    // if set to never, return
    if (paintFrequency===0) return false;

    // if set to annual, check that month = 0 and day = 1 before painting
    if (paintFrequency === 4 && date.month === 0 && date.day === 1)
    {
        // ColourChange.colourRides(featureController);
        return true;
    }
    // if set to monthly, check that day = 1 before painting
    if (paintFrequency === 3 && date.day === 1)
{
        // ColourChange.colourRides(featureController);
        return true;
    }
    // if set to weekly, check if the day remainder is 1 (will change on the 1, 8, 15, 22, 29 of the month)
    if (paintFrequency === 2 && date.day%7===1)
{
        // ColourChange.colourRides(featureController);
        return true;
    }
    // if set to daily
    if (paintFrequency === 1) return true
    // ColourChange.colourRides(featureController)
    return false
}

}
