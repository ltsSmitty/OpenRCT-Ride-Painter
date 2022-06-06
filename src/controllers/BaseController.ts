/* eslint-disable max-classes-per-file */
/* eslint-disable lines-between-class-members */
import { Store, store, ArrayStore, arrayStore } from "openrct2-flexui";
import { debug } from "../helpers/logger";
import PluginNamespace from "../helpers/config";

export default class BaseController<T> {
    all!: Store<T[]>;
    selected!: Store<T | null>;
    selectedIndex!: Store<number>;
    controllerKeys: { [props: string]: Store<any> };
    namespaceKey: string;
    library: any;

    constructor({ library = [] }: { library: T[] }) {
        this.library = library;
        this.initializeController();

        this.namespaceKey = `${this.constructor.name}`;
        // example controller keys
        this.controllerKeys = {
            baseControllerKey1: this.all,
            baseControllerKey2: this.selectedIndex,
        };
    }

    private initializeController(lib = this.library) {
        this.all = this.updateLibrary(lib);
        this.selectedIndex = store<number>(0);
        this.selected = store<T | null>(
            this.all.get()[this.selectedIndex.get()]
        );
    }

    updateLibrary(lib: T[]): Store<T[]> {
        // if it's possible to add additional themes in the future,
        // this is where they'll be loaded
        // todo this might not work?
        if (!lib) return this.all;

        this.library = lib;
        this.all = store<T[]>(lib);
        return this.all;
    }

    private getValuesToSave() {
        const vals = Object.keys(this.controllerKeys).map((key) => ({
            [key]: this.controllerKeys[key].get(),
        }));
        return vals;
    }

    saveFeatures() {
        const valToSave = this.getValuesToSave();
        context
            .getParkStorage()
            .set(`${PluginNamespace}.${this.namespaceKey}`, valToSave);
        debug(`${this.constructor.name} saved.`);
    }

    loadValuesFromStorage() {
        const loadedController = context
            .getParkStorage()
            .get(`RidePainter.${this.namespaceKey}`) as {
            [keys: string]: any;
        }[];
        if (!loadedController) return;
        this.applyValuesFromSave(loadedController);
    }

    private applyValuesFromSave(loadedVals: { [keys: string]: any }[]) {
        // why do this?
        this.updateLibrary(this.library);

        // re-apply each loaded prop to the right value
        loadedVals.forEach((prop) => {
            debug(
                `<applyValuesFromSave> \n Loaded Prop: ${JSON.stringify(prop)}`
            );
            Object.keys(prop).forEach((key) => {
                this.controllerKeys[key].set(prop[key]);
            });
            this.controllerKeys[prop[0]] = store<unknown>(loadedVals[prop[0]]);
        });
        //
        this.setSelectedFromSelectedIndex();
        return this.getActive;
    }

    getActive() {
        return {
            all: this.all,
            selected: this.selected,
            selectedIndex: this.selectedIndex,
        };
    }

    debug() {
        debug(`<debug>\n\t
        Debugging ${this.constructor.name}: \t
        all.length: ${this.all.get().length}\t
        selected: ${JSON.stringify(this.selected.get())}\t
        selectedIndex: ${this.selectedIndex.get()}
        controllerKeys: ${JSON.stringify(this.controllerKeys)}
        namespaceKey: ${this.namespaceKey}`);
    }

    setSelectedFromSelectedIndex() {
        this.selected = store<T>(this.all.get()[this.selectedIndex.get()]);
    }
}
