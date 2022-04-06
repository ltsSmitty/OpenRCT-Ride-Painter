/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference path="../lib/openrct2.d.ts" />

import { box, button, compute, colourPicker ,dropdown, horizontal, label, dropdownSpinner,
    store, window, vertical, toggle, Colour } from 'openrct2-flexui';
import { debug } from './helpers/logger';
import ColourChange from './themeSettings/ColourChange';
import themeSectionElements from './Components/themeSection';
import { modeSectionElements } from './Components/modeSection';
import groupingSectionElements from './Components/groupingSection';
import rideSelectionElements from './Components/rideSelectionSection';
import settingsSectionElements from './Components/settingsSection';
import stationStyleElements from './Components/stationStyleSection';
import {FeatureController} from './controllers/Controllers';



// Set up empty methods that will be overwritten inside StateWatcher
export class WindowWatcher
{
    // Event that triggers on window open
    static onWindowOpen?: () => void

    // Event that triggers every frame update of the window
    static onWindowUpdate?: () => void

    // Event that triggers on window close
    static onWindowClose?: () => void
}

export const themeWindow = (
    featureController: FeatureController) =>
{
    debug(`<themeWindow>`);
    featureController.debug();
    const {rideController, themeController, groupingController,
        modeController, stationController, settingsController} = featureController

    return window({
        title: 'Ride Painter',
        width: 400,
        height: 600, maxHeight: 800,
        spacing: 10,
        padding: 8,
        colours: [1,24],
        onOpen: () =>
        {
            if (WindowWatcher.onWindowOpen)
            {
                WindowWatcher.onWindowOpen()
            }
        },
        onUpdate: () =>
        {
            if (WindowWatcher.onWindowUpdate)
            {
                WindowWatcher.onWindowUpdate()
            }
        },
        onClose: () =>
        {
            if (WindowWatcher.onWindowClose)
            {
                WindowWatcher.onWindowClose()
            }
        },
        content: [
                // TOP ROW: THEME PICKER
                themeSectionElements(themeController),
                // // SECOND ROW: MODE PICKER
                modeSectionElements(modeController),
                // // THIRD ROW: GROUP BY
                groupingSectionElements(groupingController),
                // // FOURTH ROW: RIDE/TYPE SELECTION
                rideSelectionElements(rideController),
                // // SETTINGS
                settingsSectionElements(settingsController),
                stationStyleElements(stationController, rideController),
                button({
                    height: 30,
                    padding: [5,"10%"],
                    text: '6. Paint selected rides',
                    disabled: compute(rideController.selectedRides, (rides) =>
                        (rides?.length||-1)<=0),
                    onClick: () => ColourChange.colourRides(featureController),
                    tooltip: "Nothing changing? Make sure to enable 'Allow repainting of already painted rides'"
                }),

            ]
        })
}


  /**
   * Runs daily.
   * 1. Paint brand new rides if that option is seleced
   * 2. Repaint daily/weekly/monthly/annually based on store setting.
   */
export const dailyUpdate = (featureController: FeatureController) =>
{
    const {rideController, themeController, groupingController, modeController, settingsController} = featureController
    // PAINT NEW RIDES BASED ON paintBrantNewRides === true
    // reset model.rides.all
    const allRides = map.rides.filter(ride=>ride.classification === "ride")
    debug(`<dailyUpdate> \n\t model.rides: ${JSON.stringify(rideController.all.get()[0].age)}`)
    rideController.all.set(allRides);
    const paintedRides = rideController.paintedRides.get() || []
    // Check if new rides be painted automatically
    if (settingsController.getPaintBrandNewRides())
    {
        // get all the rides that haven't yet been painted
        // this will repaint all rides in the park upon park load
        // todo store paintedRides in config to reference upon park load
        const ridesToPaint = allRides.filter(ride =>
        {
            const thisRideHasBeenPainted = paintedRides.filter(r=> r.id===ride.id)
            // return if it doesn't find a match in painted
            return (thisRideHasBeenPainted.length === 0)
        })
        if (ridesToPaint.length>0)
        {
            ColourChange.colourRides(featureController, ridesToPaint);
        }
    }


    // PAINT RIDES BASED ON AUTOMATIC PAINT FREQUENCY
    //  values: ["never", "daily", "weekly", "monthly", "yearly"],
    const paintFrequency = settingsController.getAutomaticPaintFrequency();
    // if set to never, return
    if (paintFrequency===0) return;

    // if set to annual, check that month = 0 and day = 1 before painting
    if (paintFrequency === 4 && date.month === 0 && date.day === 1)
{
        ColourChange.colourRides(featureController);
        return;
    }
    // if set to monthly, check that day = 1 before painting
    if (paintFrequency === 3 && date.day === 1)
{
        ColourChange.colourRides(featureController);
        return;
    }
    // if set to weekly, check if the day remainder is 1 (will change on the 1, 8, 15, 22, 29 of the month)
    if (paintFrequency === 2 && date.day%7===1)
{
        ColourChange.colourRides(featureController);
        return;
    }
    // if set to daily
    if (paintFrequency === 1) ColourChange.colourRides(featureController)
}

