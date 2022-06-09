import { ArrayStore, arrayStore } from 'openrct2-flexui';
import { sharedStorageNamespace } from "../helpers/environment";
import { Theme, themes } from "../themeSettings/themes";
import BaseController from "./BaseController";

// eslint-disable-next-line no-use-before-define
type settingsKeys = Record<keyof ThemeController, string>;
type LookupKeyType = Partial<settingsKeys>;

export default class ThemeController extends BaseController<Theme> {
    lookupKeys: LookupKeyType;

    savedThemes!: ArrayStore<Theme>;

    constructor() {
        super(themes);
        this.controllerKeys = {
            themeSelectedIndex: this.selectedIndex,
        };
        this.lookupKeys = {
            savedThemes: `${sharedStorageNamespace}.savedThemes`,
        };
        this.setDefaults();
        this.loadThemesFromStorage();
    }

    // getValue(value: keyof typeof this.lookupKeys) {
    //     // the typeof lookupKeys is suggesting that it might be undefined, but it won't be.
    //     // casting it to string to avoid i think a 'never' case
    //     const thisKey = this.lookupKeys[value] as string;
    //     return context.sharedStorage.get(thisKey, this[value].get());
    // }

    // setValue<T>(key: keyof typeof this.lookupKeys, value: T) {
    //     const thisKey = this.lookupKeys[key] as string;
    //     context.sharedStorage.set(thisKey, value);
    // }

    setDefaults() {
        this.savedThemes = arrayStore<Theme>([]);
    }

    addCustomTheme(newTheme: Theme) {
        // save the theme into storage
        // reload the theme dropdown
        // swap the current theme to the new theme
    }

    loadThemesFromStorage() {}

    saveThemeToStorage(newTheme: Theme) {
        // get the currently saved Theme[] from storage
        // push newTheme onto it
        // set it with the newly added Theme[]
        this.getValue(this.)
    }
}
