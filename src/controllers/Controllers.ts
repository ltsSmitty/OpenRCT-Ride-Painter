/* eslint-disable max-classes-per-file */
/* eslint-disable lines-between-class-members */
import { Store, store, Colour } from 'openrct2-flexui';
import { Theme, themes } from '../themeSettings/themes';
import { debug } from "../helpers/logger";
import { Grouping, groupings } from '../themeSettings/groupings';
import { Mode, modes } from '../themeSettings/modes';
import { RideType } from '../helpers/RideType';
import { sharedStorageNamespace } from '../helpers/environment';
import PluginNamespace from '../helpers/config';

export class BaseController<T>
{
    all!: Store<T[]>;
    selected!: Store<T | null>;
    selectedIndex!: Store<number>;
    controllerKeys: {[props:string]:Store<any>};
    namespaceKey: string;
    library: any

    constructor({library=[]}:{library: T[]})
    {
        this.library = library
        this.initializeController();

        this.namespaceKey = `${this.constructor.name}`
        // example controller keys
        this.controllerKeys = {
            "baseControllerKey1":this.all,
            "baseControllerKey2":this.selectedIndex
        }
    }

    private initializeController(lib = this.library)
    {
        this.all = this.updateLibrary(lib);
        this.selectedIndex = store<number>(0)
        this.selected = store<T | null>(this.all.get()[this.selectedIndex.get()])
    }

    updateLibrary(lib: T[]): Store<T[]>
    {
        // if it's possible to add additional themes in the future,
        // this is where they'll be loaded
        // todo this might not work?
        if (!lib) return this.all;

        this.library = lib
        this.all = store<T[]>(lib);
        return this.all
    }

    private getValuesToSave()
    {
        const vals = Object.keys(this.controllerKeys).map(key=>
            ({[key]: this.controllerKeys[key].get()}))
        return vals
    }

    saveFeatures()
    {
        const valToSave = this.getValuesToSave()
        context.getParkStorage().set(`${PluginNamespace}.${this.namespaceKey}`,valToSave)
        debug(`${this.constructor.name} saved.`)
    }

    loadValuesFromStorage()
    {
        const loadedController = context.getParkStorage()
            .get((`RidePainter.${this.namespaceKey}`)) as {[keys:string]:any}[];
        if (!loadedController) return
        this.applyValuesFromSave(loadedController)
        this.debug()
    }

    private applyValuesFromSave(loadedVals: {[keys:string]:any}[])
    {
        // why do this?
        this.updateLibrary(this.library);

        // re-apply each loaded prop to the right value
        loadedVals.forEach(prop =>
            {
                debug(`<applyValuesFromSave> \n Loaded Prop: ${JSON.stringify(prop)}`)
                Object.keys(prop).forEach(key =>
                    {
                        debug(`this.controllerKeys[${key}].get(): ${JSON.stringify(this.controllerKeys[key].get())}`)
                        debug(`changing value to ${prop[key]}`)
                        this.controllerKeys[key].set(prop[key])
                        debug(`new value: ${this.controllerKeys[key].get()}`)
                    })
                this.controllerKeys[prop[0]] = store<unknown>(loadedVals[prop[0]])
            })
        //
        this.setSelectedFromSelectedIndex()
        return this.getActive
    }

    getActive()
    {
        return {
            all: this.all,
            selected: this.selected,
            selectedIndex: this.selectedIndex
        }
    }

    debug()
    {
        debug(`<debug>\n\t
        Debugging ${this.constructor.name}: \t
        all.length: ${this.all.get().length}\t
        selected: ${JSON.stringify(this.selected.get())}\t
        selectedIndex: ${this.selectedIndex.get()}
        controllerKeys: ${JSON.stringify(this.controllerKeys)}
        namespaceKey: ${this.namespaceKey}`)
    }

    setSelectedFromSelectedIndex()
    {
        this.selected = store<T>(this.all.get()[this.selectedIndex.get()])
    }
}

export class ThemeController extends BaseController<Theme>
{
    constructor()
    {
    super({library:themes});
    this.controllerKeys = {
        "themeSelectedIndex": this.selectedIndex,
        }
    }
}

export class GroupingController extends BaseController<Grouping<number|string>>
{
    constructor()
    {
    super({library:groupings})
    this.controllerKeys = {
        "themeSelectedIndex": this.selectedIndex,
        }
    }
}

export class ModeController extends BaseController<Mode>
{
    selectedCustomColours: Store<Colour[]>;
    selectedColoursEnabled: Store<boolean[]>;
    constructor()
    {
    super({library:modes})
    this.selectedCustomColours = store<Colour[]>([0,0,0,0,0,0]);
    this.selectedColoursEnabled = store<boolean[]>([true,true,true,true,true,true]);
    this.controllerKeys = {
        "themeSelectedIndex": this.selectedIndex,
        "modeSelectedCustomColours": this.selectedCustomColours,
        "modeSelectedColoursEnabled": this.selectedColoursEnabled
        }
    }
}

export class RideController extends BaseController<Ride>
{
    selectedRides: Store<Ride[] | null>;
    selectedText: Store<string>;
    paintedRides: Store<Ride[] | null>;
    allRideTypes!: Store<RideType[]>

    constructor()
    {
        const allRides = map.rides.filter(ride=>ride.classification === "ride")
        super({library: allRides});
        // set the ride types
        this.allRideTypes = store<RideType[]>([]);
        this.updateAllRideTypes()
        this.selected = store<Ride|null>(null);
        this.selectedRides = store<Ride[] | null>([]);
        this.paintedRides = store<Ride[] | null>([]);
        this.selectedText = store<string>("");

    }
    /**
     * Update the model's values for rideController.all and rideController.allRideTypes
     */
    updateRideModel()
    {
        this.updateAllRides()
        this.updateAllRideTypes();
    }

    private updateAllRides()
    {
        const allRides = map.rides.filter(ride => ride.classification === 'ride')
        this.library = [allRides];
        this.all.set(allRides)
    }

    private updateAllRideTypes()
    {
        const allRideTypes = this.all.get().map(ride => ride.type);
        const uniqueRideTypes = allRideTypes
            // get the unique ride types
            .filter(onlyUnique)
            // get only non-zero/truthy values
            .filter( n => n);
        this.allRideTypes.set(uniqueRideTypes);
        debug(`<Controller>rc.allRideTypes updated: ${uniqueRideTypes}`)
        return uniqueRideTypes;
        /**
         * Helper to get unique ride types
         */
        function onlyUnique(value: any, index: any, self: any)
        {
            return self.indexOf(value) === index;
        }
    }

    /**
     * Set this.selectedText to display which rides are selected, e.g. "3/10 rides selected"
     */
    setSelectedRidesText()
    {
    const selectedRides = this.selectedRides.get() || []
    this.selectedText.set(`{BLACK}${selectedRides.length}/${this.all.get().length} rides selected`)
    }

    override getActive()
    {
        return {
            all:this.all,
            selected: this.selected,
            selectedIndex: this.selectedIndex,
            allRideTypes: this.allRideTypes,
            selectedRides: this.selectedRides,
            selectedText: this.selectedText
        }
    }

}

export class StationController extends BaseController<LoadedObject>
{
    automaticallyApply: Store<boolean>;
    constructor()
    {
        super({library: context.getAllObjects("station")})
        // todo don't hard code in false here
        this.automaticallyApply = store<boolean>(false)
        this.controllerKeys = {
            "stationSelectedIndex": this.selectedIndex,
            "stationAutomaticallyApply": this.automaticallyApply
        }
    }
}

export class SettingsController extends BaseController<string>
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
        this.subToSettingsChange()
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

        this.debug()
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

    subToSettingsChange()
    {
        debug(`Subscribing to settings changes.`)
        this.automaticPaintFrequency.subscribe((freq) =>
        {
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

}

export class FeatureController
{
    groupingController: GroupingController;
    themeController: ThemeController;
    rideController: RideController;
    modeController: ModeController;
    stationController: StationController
    settingsController: SettingsController

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
        this.rideController.loadValuesFromStorage()
        this.modeController.loadValuesFromStorage()
        this.settingsController.loadValuesFromStorage()
        debug(`Theme, Grouping, Ride, Mode, and Setting Loaded. Loading Complete.`)
    }

    // eslint-disable-next-line class-methods-use-this
    debug()
    {
        // todo implement something more here
        debug(`FeatureController debug: //nothing here! implement something`)
    }
}
