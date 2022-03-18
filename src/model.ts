import { store, Store, Colour } from "openrct2-flexui";
import { RideType } from "./helpers/RideType";
import { Grouping, groupings } from "./themeSettings/groupings";
import { Mode, modes } from "./themeSettings/modes";
import { Theme, themes } from "./themeSettings/themes";
import { debug } from "./helpers/logger";

export type IModel = {
    themes: {
            all: Store<Theme[]>,
            // the currently selected theme and dropdown index
            selected: Store<Theme | null>,
            selectedIndex: Store<number>
    }
    // Mode data
	modes: {
        all: Store<Mode[]>,
        // the currently active mode and dropdown index
        selected: Store<Mode | null>,
        selectedIndex: Store<number>,
        // used for the 'Custom Pattern' mode
        // stores the colourPicker colours and their active state
        selectedCustomColours: Store<Colour[]>,
        selectedColoursEnabled: Store<boolean[]>
    }

    // Grouping data
    groupings: {
        all: Store<Grouping<number | string>[]>,
        // the currently active grouping and index
        selected: Store<Grouping<number | string> | null>,
        selectedIndex: Store<number>
    }

    // Ride Selection data
    rides: {
        all: Store<Ride[]>,
        // stores all ride types built in park as numerical values
        allRideTypes: Store<RideType[]>,
        // rides that will have the theme applied when colourRides() is called
        selected: Store<Ride[]>,
        selectedIndex: Store<number>,
        // displays number of rides selected e.g. "4/30 rides selected"
        selectedText: Store<string>,
        // rides that have already been painted using the plugin
        painted: Store<Ride[]>
    }

    // station settings
    stations: {
        all: Store<LoadedObject[]>,
        selected: Store<LoadedObject|null>,
        selectedIndex: Store<number>,
        automaticallyApply: Store<boolean>
    }

    // Settings data
    settings: {
        // repaint all rides at the park
        automaticPaintFrequency: Store<number>,
        // allow plugin to repaint already themed rides
        repaintExistingRides: Store<boolean>,
        // paint any newly built rides the day they're built
        paintBrantNewRides: Store<boolean>,
        // paint rides that start the scenario
        paintScenarioStartingRides: Store<boolean>
    }
}

/**
 * Helper to get unique ride types
 */
 function onlyUnique(value: any, index: any, self: any)
 {
     return self.indexOf(value) === index;
 }

/**
 * Initializes ride data into the store.
 */
const rideInit = (model: IModel) =>
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

/**
 * Initialize station settings
 */
export const stationSettingsInit = (model: IModel) =>
{
    const allStationStyles = context.getAllObjects("station")
    model.stations.all.set(allStationStyles);
    model.stations.automaticallyApply.set(false);
}

/**
 * Initializes mode data into the store.
 */
const modeInit = (model: IModel) =>
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
 * Initializes theme data into the store.
 */
const themeInit = (model: IModel) =>
{
    model.themes.all.set(themes);
    // for spiciness, randomly choose a theme to set
    const startingTheme = context.getRandom(0,themes.length-1)
    model.themes.selectedIndex.set(startingTheme);
    model.themes.selected.set(model.themes.all.get()[model.themes.selectedIndex.get()]);
};

/**
 * Initializes grouping data into the store. Checks the game's config to persist from one load to another
 */
const groupingInit = (model: IModel) =>
{
    model.groupings.all.set(groupings);
    model.groupings.selectedIndex.set(0);
    model.groupings.selected.set(model.groupings.all.get()[model.groupings.selectedIndex.get()])
}

/**
 * Initializes settings data into the store. Checks the game's config to persist from one load to another
 */
const settingInit = (model: IModel) =>
{
    // check if there are any setting values stored
    // it's sufficient to check for one, because having one is as good as having all
    if (!model.settings.automaticPaintFrequency.get())
    {
        model.settings.repaintExistingRides.set(true);
        model.settings.paintBrantNewRides.set(true);
        model.settings.paintScenarioStartingRides.set(true);
    }
}

/**
 * To be called during plugin mount.  Paint all rides
 */
const paintPrebuiltScenarioRides = (model: IModel) =>
{
    // check if painting starting rides enabled
    if (model.settings.paintScenarioStartingRides.get())
    {
        debug(`adding starting scenario rides to rides.painted`)
        const startingRides = map.rides.filter(ride=> ride.classification === "ride");
        model.rides.painted.set(startingRides);
    }

}


/**
 * Record the model information inside of stores so the values can be read/updated by the UI
 */
 export const model: IModel = {
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


modeInit(model);
themeInit(model);
rideInit(model);
groupingInit(model);
settingInit(model);
stationSettingsInit(model);


