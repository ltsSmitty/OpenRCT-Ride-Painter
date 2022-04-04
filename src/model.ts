/* eslint-disable no-use-before-define */
/* eslint-disable guard-for-in */
import { store, Store, Colour } from "openrct2-flexui";
import { RideType } from "./helpers/RideType";
import { Grouping, groupings } from "./themeSettings/groupings";
import { Mode, modes } from "./themeSettings/modes";
import { Theme, themes } from "./themeSettings/themes";
import { debug } from "./helpers/logger";
import { config } from './services/stateWatcher';

/**
 * Explicitly define a store-based model. Not needed due to typedefs above
 */

 const model = {
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
        paintBrantNewRides: store<boolean>(false)
    }

};

export default model
