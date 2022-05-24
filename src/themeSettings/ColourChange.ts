/* eslint-disable no-use-before-define */
/// <reference path="../../lib/openrct2.d.ts" />
import { combineCustomColourArrays } from "../Components/modeSection";
import FeatureController from "../controllers/FeatureController";
import RideController from "../controllers/RideController";
import StationController from "../controllers/StationController";
import { debug } from "../helpers/logger";

export default class ColourChange
{
  /**
 * @param part is defined from ColourChange table:
 * 0: TrackColourMain,
 * 1: TrackColourAdditional,
 * 2: TrackColourSupports,
 * 3: VehicleColourBody,
 * 4: VehicleColourTrim,
 * 5: VehicleColourTernary,
 * 6: VehicleColourScheme,
 * 7: EntranceStyle
 * @param colour is from 0-31
 */
    private static setRideColourPart = (ride: Ride, part:number, colour: number) =>
    {
        if (colour === -1) return;
        if (colour >= 0 && colour < 32)
        {
        context.executeAction('ridesetappearance', {
            ride: ride.id,
            type: part,
            value: colour,
            index: 0,
            flags: 0,
        },
        // Awkward callback but necessary
        () => { });
        }
        else
        {
        /* eslint-disable no-console */
        console.log(`Colour not changed for ride ${ride.name} for part ${part}.
        Given colour ${colour} is outside the acceptable range of 0-31.
        To keep a colour value unchanged without getting this warning, pass in '-1' for the colour value.`);
        }
    };

    /**
     * Set a ride's colour. To not change a colour for a param, input -1 for the param.
     */
    static setRideColour = (
        ride: Ride,
        mainColour:number = -1,
        additionalColour: number = -1,
        supportsColour: number = -1,
        vehicleBodyColour: number = -1,
        vehicleTrimColour: number = -1,
        vehicleTernaryColour: number = -1,
    ) =>
    {
        ColourChange.setRideColourPart(ride, 0, mainColour);
        ColourChange.setRideColourPart(ride, 1, additionalColour);
        ColourChange.setRideColourPart(ride, 2, supportsColour);
        ColourChange.setRideColourPart(ride, 3, vehicleBodyColour);
        ColourChange.setRideColourPart(ride, 4, vehicleTrimColour);
        ColourChange.setRideColourPart(ride, 5, vehicleTernaryColour);
    };

    public static setRideStationStyle = (ride:Ride, stationStyle: number) =>
    {
        ColourChange.setRideColourPart(ride, 7, stationStyle);
    };

    public static colourRides = (fc: FeatureController, ridesToPaint?:Ride[],) =>
    {
        const {
            rideController, themeController, groupingController,
            modeController, settingsController, stationController} = fc
        const currentTheme = themeController.selected.get();
        const currentMode = modeController.selected.get();
        const currentGrouping = groupingController.selected.get();

        // guard to make sure there's a theme, mode and grouping.
        if (!(currentTheme && currentMode && currentGrouping)) return;

        /**
         * Filter given rides based on repaintedExistingRides value
         * @returns rides to be painted
         */
        const filterRidesToTheme = (initialRidesToTheme = (ridesToPaint) || rideController.selectedRides.get() || []) =>
        {
            let finalRidesToTheme: Ride[];
            if (settingsController.getRepaintExistingRides()===false)
            {
                finalRidesToTheme = initialRidesToTheme?.filter(ride => (
                        rideController.paintedRides.get()?.indexOf(ride)===-1))
            }
            else finalRidesToTheme = initialRidesToTheme
            return finalRidesToTheme
        }

        const ridesToTheme = filterRidesToTheme(ridesToPaint)

        // group rides together so they're painted identically
        const groupedRides = currentGrouping.applyGrouping(ridesToTheme);

        // for each group of rides
        Object.keys(groupedRides).forEach((group, i) =>
        {
            // get the 6 ride colours based on the theme and mode
            const colours = currentMode.applyTheme(
                currentTheme,
                {
                    customColours: combineCustomColourArrays(modeController),
                    index: i
                });
            if (!colours) return;

            // apply the colour to each ride
            groupedRides[group].forEach(ride =>
            {
                // If it's a maze, the maze theme type only looks at colours[2]. If that is >3, the maze bugs out
                // Need to make sure it's not that before moving on
                // todo refactor the 3 to be the length of maze style list
                if (ride.type === 20 && colours[2]>3) return;

                // Actually do the painting!
                this.setRideColour(ride, ...colours);
                this.markRideAsHavingBeenPainted(ride, rideController)

                // if station is set to update automatically, do it
                if (stationController.automaticallyApply.get())
                {
                    this.setRideStationStyle(ride,stationController.selectedIndex.get())
                }
            })
        });

        // Flip the toggle on the RideController paint toggle to let the UI know that painting has happened
        // this trigger is referenced in RideRepaintSection to cause the right column of the UI to update
        rideController.paintToggle.set(!rideController.paintToggle.get());
        debug(`paint toggle has changed to ${rideController.paintToggle.get()}`)
    }

    /**
     * Mark a ride as having been painted.
     * Prevents the ride from being repainted if 'Allow repainting of already painted rides' is disabled.
     */
    public static markRideAsHavingBeenPainted = (ride: Ride, rc:RideController) =>
    {
        const previouslyPaintedRides = rc.paintedRides.get() || []
        // if the ride isn't already on the list
        if (previouslyPaintedRides.indexOf(ride)===-1)
        {
            previouslyPaintedRides.push(ride)
            rc.paintedRides.set(previouslyPaintedRides);
        }
    }

    public static changeRideStationStyle = (rides: Ride[], sc:StationController) =>
    {
        const newStationStyle = sc.selected.get() || sc.all.get()[0];
        rides.forEach(ride=>
        {
            ColourChange.setRideStationStyle(ride,newStationStyle.index)
        })
    }
  // end of class
}





