import { Store, store, ArrayStore, arrayStore } from "openrct2-flexui";
import { debug } from "../helpers/logger";
import PluginNamespace from "../helpers/config";

export default class BaseController<T> {
    all!: ArrayStore<T>;

    selected!: Store<T | null>;

    selectedIndex!: Store<number>;

    controllerKeys: { [props: string]: Store<any> };

    namespaceKey: string;

    constructor(all: T[]) {
        this.initializeController(all);

        this.namespaceKey = `${this.constructor.name}`;
        // example controller keys
        this.controllerKeys = {
            baseControllerKey1: this.all,
            baseControllerKey2: this.selectedIndex,
        };
    }

    private initializeController(all: T[]) {
        this.all = arrayStore<T>(all);
        this.selectedIndex = store<number>(0);
        this.selected = store<T | null>(
            this.all.get()[this.selectedIndex.get()]
        );
    }

    private getValuesToSave() {
        const vals = Object.keys(this.controllerKeys).map((key) => ({
            [key]: this.controllerKeys[key].get(),
        }));
        return vals;
    }

    saveFeatures(storageChoice: "park" | "global" = "park") {
        const valToSave = this.getValuesToSave();
        if (storageChoice === "park") {
            context
                .getParkStorage()
                .set(`${PluginNamespace}.${this.namespaceKey}`, valToSave);
            debug(`${this.constructor.name} saved to park storage.`);
            return;
        }
        context.sharedStorage.set(
            `${PluginNamespace}.${this.namespaceKey}`,
            valToSave
        );
        debug(`${this.constructor.name} saved to global storage.`);
    }

    loadValuesFromStorage(storageChoice: "park" | "global" = "park") {
        let loadedController;
        if (storageChoice === "park") {
            loadedController = context
                .getParkStorage()
                .get(`RidePainter.${this.namespaceKey}`) as {
                [keys: string]: any;
            }[];
            if (!loadedController) return;
            this.applyValuesFromSave(loadedController);
            return;
        }
        loadedController = context.sharedStorage.get(
            `RidePainter.${this.namespaceKey}`
        ) as {
            [keys: string]: any;
        }[];
        if (!loadedController) return;
        this.applyValuesFromSave(loadedController);
    }

    private applyValuesFromSave(loadedVals: { [keys: string]: any }[]) {
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
