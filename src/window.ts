/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference path="../lib/openrct2.d.ts" />

import { box, button, compute, colourPicker ,dropdown, horizontal, label, dropdownSpinner,
    store, window, vertical, toggle, Colour } from 'openrct2-flexui';
import { Mode, modes } from './themeSettings/modes';
import { Theme, themes } from './themeSettings/themes';
import { debug } from './helpers/logger';
import ColourChange from './themeSettings/ColourChange';
import { RideType } from './helpers/RideType';
import { Grouping, groupings } from './themeSettings/groupings';
import themeSectionElements from './windowSections/themeSection';
import { modeSectionElements } from './windowSections/modeSection';
import groupingSectionElements from './windowSections/groupingSection';
import rideSelectionElements from './windowSections/rideSelectionSection';
import settingsSectionElements from './windowSections/settingsSection';
import { model } from './model';



// Set up empty methods that will be filled inside StateWatcher
export class WindowWatcher
{
    // Event that triggers on window open
    static onWindowOpen?: () => void

    // Event that triggers every frame update of the window
    static onWindowUpdate?: () => void
        // // Page picker text output
        // const selectedRides = model.rides.selected.get();
        // // set the text for number of rides selected
        // model.rides.selectedText.set(`{BLACK}${selectedRides.length}/${model.rides.all.get().length} rides selected`)
        // // update model.rides.all and model.rides.allRideTypes
        // rideTypeInit();

    // Event that triggers on window close
    static onWindowClose?: () => void
}

export const themeWindow = window({
	title: 'Ride Painter',
    width: 400,
	height: 500, maxHeight: 800,
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
            themeSectionElements(),
            // SECOND ROW: MODE PICKER
            modeSectionElements(),
            // THIRD ROW: GROUP BY
            groupingSectionElements(),
            // FOURTH ROW: RIDE/TYPE SELECTION
            rideSelectionElements(),
            // SETTINGS
            settingsSectionElements(),
            button({
                height: 30,
                padding: [5,"10%"],
                text: '6. Paint selected rides',
                disabled: compute(model.rides.selected , (rides) => rides.length<=0),
                onClick: () => ColourChange.colourRides(),
                tooltip: "Nothing changing? Make sure to enable 'Allow repainting of already painted rides'"
            }),
            // STATION STYLE

        ]
    })

  /**
   * Runs daily.
   * 1. Paint brand new rides if that option is seleced
   * 2. Repaint daily/weekly/monthly/annually based on store setting.
   */
export const dailyUpdate = () =>
{
    // PAINT NEW RIDES BASED ON paintBrantNewRides === true
    // reset model.rides.all
    const allRides = map.rides.filter(ride=>ride.classification === "ride")
    model.rides.all.set(allRides);
    const paintedRides = model.rides.painted.get()
    // Check if new rides be painted automatically
    if (model.settings.paintBrantNewRides.get())
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
            ColourChange.colourRides(ridesToPaint);
        }
    }


    // PAINT RIDES BASED ON AUTOMATIC PAINT FREQUENCY
    //  values: ["never", "daily", "weekly", "monthly", "yearly"],
    const paintFrequency = model.settings.automaticPaintFrequency.get();
    // if set to never, return
    if (paintFrequency===0) return;

    // if set to annual, check that month = 0 and day = 1 before painting
    if (paintFrequency === 4 && date.month === 0 && date.day === 1)
{
        ColourChange.colourRides();
        return;
    }
    // if set to monthly, check that day = 1 before painting
    if (paintFrequency === 3 && date.day === 1)
{
        ColourChange.colourRides();
        return;
    }
    // if set to weekly, check if the day remainder is 1 (will change on the 1, 8, 15, 22, 29 of the month)
    if (paintFrequency === 2 && date.day%7===1)
{
        ColourChange.colourRides();
        return;
    }
    // if set to daily
    if (paintFrequency === 1) ColourChange.colourRides()
}

