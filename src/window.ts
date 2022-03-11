/// <reference path="../lib/openrct2.d.ts" />

import { box, button, compute, colourPicker ,dropdown, horizontal, label, dropdownSpinner,
    store, window, vertical, toggle, Colour } from 'openrct2-flexui';
import { Mode, modes } from './themeSettings/modes';
import { Theme, themes } from './themeSettings/themes';
import { debug } from './helpers/logger';
import ColourChange from './themeSettings/ColourChange';
import { RideType } from './RideType';
import { Grouping, groupings } from './themeSettings/groupings';
import themeSectionElements from './windowSections/themeSection';
import { modeSectionElements } from './windowSections/modeSection';
import groupingSectionElements from './windowSections/groupingSection';
import rideSelectionElements from './windowSections/rideSelectionSection';
import settingsSectionElements from './windowSections/settingsSection';


/**
 * Record the model information inside of stores so the values can be read/updated by the UI
 */
export const model = {
	// Theme data
    themes: {
        all: store<Theme[]>([]),
        // the currently selected theme and dropdown index
        selected: store<Theme | null>(null),
        selectedIndex: store<number>(0),
    },
    // Mode data
	modes: {
        all: store<Mode[]>([]),
        // the currently active mode and dropdown index
        selected: store<Mode | null>(null),
        selectedIndex: store<number>(0),
        // used for the 'Custom Pattern' mode
        // stores the colourPicker colours and their active state
        selectedCustomColours: store<Colour[]>([0,0,0,0,0,0]),
        selectedColoursEnabled: store<boolean[]>([true,true,true,true,true,true])
    },
    // Grouping data
    groupings: {
        all: store<Grouping<number | string>[]>([]),
        // the currently active grouping and index
        selected: store<Grouping<number | string> | null> (null),
        selectedIndex: store<number>(0),
    },
    // Ride Selection data
    rides: {
        all: store<Ride[]>([]),
        // stores all ride types built in park as numerical values
        allRideTypes: store<RideType[]>([]),
        // rides that will have the theme applied when colourRides() is called
        selected: store<Ride[]>([]),
        selectedIndex: store<number>(0),
        // displays number of rides selected e.g. "4/30 rides selected"
        selectedText: store<string>(""),
        // rides that have already been painted using the plugin
        painted: store<Ride[]>([])
    },
    // station settings
    stations: {
        all: store<LoadedObject[]>([]),
        selected: store<LoadedObject|null>(null),
        selectedIndex: store<number>(0),
        automaticallyApply: store<boolean>(true)
    },
    // Settings data
    settings: {
        // repaint all rides at the park
        automaticPaintFrequency: store<number>(0),
        // allow plugin to repaint already themed rides
        repaintExistingRides: store<boolean>(false),
        // paint any newly built rides the day they're built
        paintBrantNewRides: store<boolean>(false),
        // paint rides that start the scenario
        paintScenarioStartingRides: store<boolean>(false)
    }

};

/**
 * Initializes ride data into the store. Checks the game's config to persist from one load to another
 */
const rideTypeInit = () =>
{
    // get rides from map and set to model.rides.all
    const allRides=map.rides.filter(ride => ride.classification === 'ride')
    model.rides.all.set(allRides)

    const allRideTypes = allRides.map(ride => ride.type);
    const uniqueRideTypes = allRideTypes
        // get the unique ride types
        .filter(onlyUnique)
        // get only non-zero/truthy values
        .filter( n => n);
    model.rides.allRideTypes.set(uniqueRideTypes);

}

export const initStationSettings = () =>
{
    const allStationStyles = context.getAllObjects("station")
    model.stations.all.set(allStationStyles);
    model.stations.automaticallyApply.set(false);
}

/**
 * Run on game load to set up initial plugin settings
 */
export const initPluginSettings = () =>
{
    /**
     * Initializes mode data into the store. Checks the game's config to persist from one load to another
     */
    const modeInit = () =>
{
        model.modes.all.set(modes);
        // for spiciness, randomly choose a theme to set
        const startingMode = context.getRandom(0,modes.length-1)
        model.modes.selectedIndex.set(startingMode);
        model.modes.selected.set(model.modes.all.get()[model.modes.selectedIndex.get()]);
        // for 'Custom Pattern' mode
        model.modes.selectedCustomColours.set([0, 0, 0, 0, 0, 0]);
        model.modes.selectedColoursEnabled.set([true, false, true, true, false, true,]);
    };

    /**
     * Initializes theme data into the store. Checks the game's config to persist from one load to another
     */
    const themeInit = () =>
{
        // only needed once per game load
        model.themes.all.set(themes);
        // for spiciness, randomly choose a theme to set
        const startingTheme = context.getRandom(0,themes.length-1)
        model.themes.selectedIndex.set(startingTheme);
        // only needed once per game load
        model.themes.selected.set(model.themes.all.get()[model.themes.selectedIndex.get()]);
    };

    /**
     * Initializes grouping data into the store. Checks the game's config to persist from one load to another
     */
    const groupingInit = () =>
{
        model.groupings.all.set(groupings);
        model.groupings.selectedIndex.set(0);
        model.groupings.selected.set(model.groupings.all.get()[model.groupings.selectedIndex.get()])
    }

    /**
     * Initializes settings data into the store. Checks the game's config to persist from one load to another
     */
    const settingInit = () =>
{
        model.settings.repaintExistingRides.set(true);
        model.settings.paintBrantNewRides.set(true);
        model.settings.paintScenarioStartingRides.set(true);
    }
    /**
     * if it's not day 1 or the box isn't checked, don't paint the rides
     * by adding all the existing rides to model.rides.paintedRides
     */
    const paintPrebuiltScenarioRides = () =>
{
        // if it's day 1,
        debug(`day: ${date.day}, month: ${date.month}, year: ${date.year}, months elapsed: ${date.monthsElapsed}`)
        if (date.day === 0 && date.month === 1 && date.year === 1)
{
            debug(`it's day one`);
            // if the box is checked, do nothing
            // if the box isn't checked, treat all rides like they've been painted
            if (!model.settings.paintScenarioStartingRides.get())
{
                debug(`adding starting scenario rides to rides.painted`)
                const startingRides = map.rides.filter(ride=> ride.classification === "ride");
                model.rides.painted.set(startingRides);
            }
        }
    }

    modeInit();
    themeInit();
    rideTypeInit();
    groupingInit();
    settingInit();
    initStationSettings();

    paintPrebuiltScenarioRides();
}
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
	height: 600, maxHeight: 800,
    spacing: 10,
	padding: 8,
    colours: [1,24],
	onOpen: () =>
    {
        debug(`(window) window opened`);
        if (WindowWatcher.onWindowOpen)
        {
            WindowWatcher.onWindowOpen()
        }
    },
    onUpdate: () =>
    {
        debug(`debug: on window update`)
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
 * Helper to get unique ride types
 */
function onlyUnique(value: any, index: any, self: any)
{
    return self.indexOf(value) === index;
  }

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

