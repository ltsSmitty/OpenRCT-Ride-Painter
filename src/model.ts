/* eslint-disable no-use-before-define */
/* eslint-disable guard-for-in */
import { store, Store, Colour } from "openrct2-flexui";
import { RideType } from "./helpers/RideType";
import { Grouping, groupings } from "./themeSettings/groupings";
import { Mode, modes } from "./themeSettings/modes";
import { Theme, themes } from "./themeSettings/themes";
import { debug } from "./helpers/logger";
import { config } from './services/stateWatcher';

// Set up the model architecture
type ModelFeatures = Theme | Mode | Grouping<string|number> | LoadedObject | Ride

interface GeneralModel <T extends ModelFeatures> {
    all: T[],
    selected: T | null,
    selectedIndex: number
}

interface ThemesModel extends GeneralModel<Theme> {}
interface ThemesModelToSave extends Omit<ThemesModel,"all"|"selected"> {}

interface ModesModel extends GeneralModel<Mode> {
    selectedCustomColours: Colour[],
    selectedColoursEnabled: boolean[]
}
interface ModesModelToSave extends Omit<ModesModel,"all"|"selected"> {}

interface GroupingsModel extends GeneralModel<Grouping<number|string>> {}
interface GroupingsModelToSave extends Omit<GroupingsModel,"all"|"selected"> {}

// use Omit to overwrite selected to be an array
interface RidesModel extends Omit<GeneralModel<Ride>,"selected"> {
    selected: Ride[],
    allRideTypes: RideType[],
    selectedText: string,
    painted: Ride[]
}
interface RidesModelToSave extends Omit<RidesModel,"all"|"allRideTypes"> {}

interface StationsModel extends GeneralModel<LoadedObject> {
    automaticallyApply: boolean
}
interface StationsModelToSave extends Omit<StationsModel,"all"> {}

type ModelToSave = {
    themes: ThemesModelToSave,
    modes: ModesModelToSave,
    rides: RidesModelToSave,
    stations: StationsModelToSave,
    groupings: GroupingsModelToSave
}

interface SettingsModel {
    automaticPaintFrequency: number,
    repaintExistingRides: boolean,
    paintBrantNewRides: boolean
}

type SerialModel = {
    themes: ThemesModel,
    modes: ModesModel,
    groupings: GroupingsModel,
    rides: RidesModel,
    stations: StationsModel,
    settings: SettingsModel
}

/**
 * Convert a serial object to a Store
 */
type CreateStore<T> = {
    [Properties in keyof T]: Store<T[Properties]>
}

type StoreModel = {
    themes: CreateStore<ThemesModel>,
    modes: CreateStore<ModesModel>,
    groupings: CreateStore<GroupingsModel>,
    rides: CreateStore<RidesModel>,
    stations: CreateStore<StationsModel>,
    settings: CreateStore<SettingsModel>
}

const makeStoreValue = <T>(obj: T) => store<T>(obj)

const createStoreFromObj = <T>(obj: T): CreateStore<T> =>
{
    const returner = ({ ...obj}) as unknown as CreateStore<T>
    for (const key in obj)
    {
        if ({}.hasOwnProperty.call(obj,key))
        returner[key] = makeStoreValue(obj[key])
    }
    return returner
}

/**
 * Create static model
 */
const newModel: SerialModel = {
    themes: {
        all: [],
        selected: null, //
        selectedIndex: 0 //
    },
    modes: {
        all: [],
        selected: null, //
        selectedIndex: 0, //
        selectedCustomColours: [], //
        selectedColoursEnabled: [] //
    },
    groupings: {
        all: [],
        selected: null, //
        selectedIndex: 0 //
    },
    rides: {
        all: [],
        allRideTypes: [],
        selected: [], //
        selectedIndex: 0, //
        selectedText: "", //
        painted: [] //
    },
    stations: {
        all: [],
        selected: null, //
        selectedIndex: 0, //
        automaticallyApply: false //
    },
    settings: {
        automaticPaintFrequency: 0,
        repaintExistingRides: false,
        paintBrantNewRides: false
    }
}

const createNewModelStore = (serialModel:SerialModel):StoreModel =>
({
        themes: createStoreFromObj(serialModel.themes),
        modes: createStoreFromObj(serialModel.modes),
        groupings: createStoreFromObj(serialModel.groupings),
        rides: createStoreFromObj(serialModel.rides),
        stations: createStoreFromObj(serialModel.stations),
        settings: createStoreFromObj(serialModel.settings)
})



const dehydrateModelForStorage = (m: StoreModel): ModelToSave =>
({
    themes: {
        selectedIndex: m.themes.selectedIndex.get()
    },
    modes: {
        selectedIndex: m.modes.selectedIndex.get(),
        selectedCustomColours: m.modes.selectedCustomColours.get(),
        selectedColoursEnabled: m.modes.selectedColoursEnabled.get()
    },
    groupings: {
        selectedIndex: m.groupings.selectedIndex.get()
    },
    rides: {
        selected: m.rides.selected.get(),
        selectedIndex: m.rides.selectedIndex.get(),
        selectedText: m.rides.selectedText.get(),
        painted:m.rides.painted.get()
    },
    stations: {
        selected: m.stations.selected.get(),
        selectedIndex: m.stations.selectedIndex.get(),
        automaticallyApply: m.stations.automaticallyApply.get()
    }
    })

const model = createNewModelStore(newModel)

const rehydrateModelFromStorage = (dehy: ModelToSave):SerialModel =>
{
    const hydratedModel = dehy as SerialModel;
    hydratedModel.themes.all = themes;
    hydratedModel.themes.selected = themes[dehy.themes.selectedIndex]
    hydratedModel.modes.all = modes;
    hydratedModel.modes.selected = modes[dehy.modes.selectedIndex];
    hydratedModel.groupings.all = groupings;
    hydratedModel.groupings.selected = groupings[dehy.groupings.selectedIndex];
    hydratedModel.stations.all = context.getAllObjects("station");
    hydratedModel.rides.all = getAllRides();
    hydratedModel.rides.allRideTypes = getAllRideTypes();
    hydratedModel.settings = {
        automaticPaintFrequency: config.getAutomaticPaintFrequency(),
        repaintExistingRides: config.getRepaintExistingRides(),
        paintBrantNewRides: config.getPaintBrandNewRides()

    }
    return hydratedModel
}
/**
 * Transform model loaded from park storage into actionable model
 */
const restoreLoadedModel = (dehydratedModel: ModelToSave) =>
// Rehydrates (restore missing properties) from saved model and turns back into a store
    createNewModelStore(rehydrateModelFromStorage(dehydratedModel))

/**
 * get rides from map and set to model.rides.all
 */
const getAllRides = () =>
    map.rides.filter(ride => ride.classification === 'ride')

const getAllRideTypes = () =>
{
    const allRideTypes = getAllRides().map(ride => ride.type);
    return allRideTypes
        // get the unique ride types
        .filter(onlyUnique)
        // get only non-zero/truthy values
        .filter( n => n);
}

const initializeStoreModel =
{
    rides: () =>
    {
        const allRides = model.rides.all.set(getAllRides());
        const allRideTypes = model.rides.allRideTypes.set(getAllRideTypes())
        return {allRides,allRideTypes}
    },
    modes: () =>
    {
        const allModes = modes
        model.modes.all.set(allModes);
        // for spiciness, randomly choose a theme to set
        const startingMode = context.getRandom(0,modes.length-1)
        model.modes.selectedIndex.set(startingMode);
        model.modes.selected.set(model.modes.all.get()[model.modes.selectedIndex.get()]);
        // for 'Custom Pattern' mode
        const startingCustomColours = [0, 0, 0, 0, 0, 0]
        model.modes.selectedCustomColours.set(startingCustomColours);
        const startingColoursEnabled = [true, false, true, true, false, true,]
        model.modes.selectedColoursEnabled.set(startingColoursEnabled);
        return {
            allModes,
            selectedMode: allModes[startingMode],
            selectedModeIndex: startingMode,
            selectedCustomColours: startingCustomColours,
            selectedColoursEnabled: startingColoursEnabled
        }
    },
    themes: () =>
    {
        const allThemes = themes;
        model.themes.all.set(allThemes);
        // for spiciness, randomly choose a theme to set
        const startingTheme = context.getRandom(0,themes.length-1)
        model.themes.selectedIndex.set(startingTheme);
        model.themes.selected.set(model.themes.all.get()[model.themes.selectedIndex.get()]);
        return {
            allThemes,
            selectedTheme: allThemes[startingTheme],
            selectedThemeIndex: startingTheme
        }
    },
    groupings: () =>
    {
        const allGroupings = groupings
        model.groupings.all.set(allGroupings);
        const startingIndex = 0
        model.groupings.selectedIndex.set(startingIndex);
        model.groupings.selected.set(model.groupings.all.get()[model.groupings.selectedIndex.get()])
        return {
            allGroupings,
            selectedGrouping: allGroupings[startingIndex],
            selectedGroupingIndex: startingIndex
        }
    },
    stationSettings: () =>
    {
        const allStationStyles = context.getAllObjects("station")
        model.stations.all.set(allStationStyles);
        const automaticallyApplyStationStyling = false
        model.stations.automaticallyApply.set(automaticallyApplyStationStyling);
        return {
            allStationStyles,
            automaticallyApplyStationStyling
        }
    }
}

const updateRideStore = initializeStoreModel.rides;

/**
 * Set starting values for rides, groupings, modes, themes, and station settings
 * Returns a serial version of the values
 */
const initializeStoreModelAll = () =>
({
    groupings: initializeStoreModel.groupings(),
    modes: initializeStoreModel.modes(),
    rides: initializeStoreModel.rides(),
    stationSettings:initializeStoreModel.stationSettings(),
    themes: initializeStoreModel.themes(),
})

const saveModelIntoParkStorage = (m: StoreModel) =>
{
    const modelToSave  = dehydrateModelForStorage(m);
    context.getParkStorage().set("RidePainter.model",modelToSave);
    debug(`value saved: ${JSON.stringify(modelToSave)}`)
    debug(`value loaded: ${JSON.stringify(context.getParkStorage().get("RidePainter.model"))}`)
    return context.getParkStorage().get("RidePainter.model") as ModelToSave
}


export {
    saveModelIntoParkStorage,
    updateRideStore,
    initializeStoreModelAll,
    restoreLoadedModel,
    StoreModel, ModelToSave,
    model,

}
/**
 * Helper to get unique ride types
 */
 function onlyUnique(value: any, index: any, self: any)
 {
     return self.indexOf(value) === index;
 }

/**
 * Explicitly define a store-based model. Not needed due to typedefs above
 */
//  export const model = {
// 	// Theme data
//     themes: {
//         all: store<Theme[]>([]),
//         // the currently selected theme and dropdown index
//         selected: store<Theme | null>(null),
//         selectedIndex: store<number>(0),
//     },
//     // Mode data
// 	modes: {
//         all: store<Mode[]>([]),
//         // the currently active mode and dropdown index
//         selected: store<Mode | null>(null),
//         selectedIndex: store<number>(0),
//         // used for the 'Custom Pattern' mode
//         // stores the colourPicker colours and their active state
//         selectedCustomColours: store<Colour[]>([0,0,0,0,0,0]),
//         selectedColoursEnabled: store<boolean[]>([true,true,true,true,true,true])
//     },
//     // Grouping data
//     groupings: {
//         all: store<Grouping<number | string>[]>([]),
//         // the currently active grouping and index
//         selected: store<Grouping<number | string> | null> (null),
//         selectedIndex: store<number>(0),
//     },
//     // Ride Selection data
//     rides: {
//         all: store<Ride[]>([]),
//         // stores all ride types built in park as numerical values
//         allRideTypes: store<RideType[]>([]),
//         // rides that will have the theme applied when colourRides() is called
//         selected: store<Ride[]>([]),
//         selectedIndex: store<number>(0),
//         // displays number of rides selected e.g. "4/30 rides selected"
//         selectedText: store<string>(""),
//         // rides that have already been painted using the plugin
//         painted: store<Ride[]>([])
//     },
//     // station settings
//     stations: {
//         all: store<LoadedObject[]>([]),
//         selected: store<LoadedObject|null>(null),
//         selectedIndex: store<number>(0),
//         automaticallyApply: store<boolean>(true)
//     },
//     // Settings data
//     settings: {
//         // repaint all rides at the park
//         automaticPaintFrequency: store<number>(0),
//         // allow plugin to repaint already themed rides
//         repaintExistingRides: store<boolean>(false),
//         // paint any newly built rides the day they're built
//         paintBrantNewRides: store<boolean>(false)
//     }

// };
