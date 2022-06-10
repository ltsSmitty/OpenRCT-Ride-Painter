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
            // baseControllerKey1: this.all,
            // baseControllerKey2: this.selectedIndex,
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

    saveFeatures() {
        const valToSave = this.getValuesToSave();
        context
            .getParkStorage()
            .set(`${PluginNamespace}.${this.namespaceKey}`, valToSave);
        debug(`${this.constructor.name} saved to park storage.`);
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
        // re-apply each loaded prop to the right value
        loadedVals.forEach((prop) => {
            Object.keys(prop).forEach((key) => {
                if (!this.controllerKeys[key]) {
                    debug(
                        `${
                            this.constructor.name
                        }.controllerKeys[${key}] doesn't exist for prop ${JSON.stringify(
                            prop
                        )}`
                    );
                    // remove it from
                    this.removeInvalidKeyFromStorage(key);
                }
                this.controllerKeys[key]?.set(prop[key]);
            });
            this.controllerKeys[prop[0]] = store<unknown>(loadedVals[prop[0]]);
        });
        this.setSelectedFromSelectedIndex();
        return this.getActive;
    }

    /**
     * If a key's name changes in development, it'll languish in storage and prevent the plugin from loading
     * This will solve that problem by removing the improper prop name
     * @param key
     */
    removeInvalidKeyFromStorage(key: string) {
        const loadedController = context
            .getParkStorage()
            .get(`RidePainter.${this.namespaceKey}`) as {
            [keys: string]: any;
        }[];

        const wrongKey = Object.keys(loadedController[0]).indexOf(key);
        loadedController.splice(wrongKey, 1);

        context
            .getParkStorage()
            .set(`RidePainter.${this.namespaceKey}`, loadedController);
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
