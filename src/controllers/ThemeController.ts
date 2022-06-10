import { ArrayStore, arrayStore } from "openrct2-flexui";
import { sharedStorageNamespace } from "../helpers/environment";
import { Theme, themes } from "../themeSettings/themes";
import BaseController from "./BaseController";
import { debug } from "../helpers/logger";

export default class ThemeController extends BaseController<Theme> {
    lookupKeys;

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
        this.subscribeToAdditionalThemes();
        this.removeEmptyThemesFromDropdown();
    }

    addNewThemeToModel(newTheme: Theme) {
        // add the new theme into storage
        const newThemeIndex = this.savedThemes.push(newTheme);
        // save the new Theme[] into storage
        this.setValue("savedThemes", this.savedThemes.get());
        // swap the current theme to the new theme
        this.selectedIndex.set(newThemeIndex);
        this.selected.set(this.all.get()[newThemeIndex]);
    }

    removeEmptyThemesFromDropdown() {
        // filter out ride without both a name and colours
        const cleanSavedThemes = this.savedThemes
            .get()
            .filter(
                (theme) =>
                    theme.colours.themeColours.length > 0 &&
                    theme.name.length > 0
            );
        // set that into storage
        this.setValue("savedThemes", cleanSavedThemes);

        // do the same filter for all themes
        const allThemes = this.all.get();
        const nonEmptyThemeArray = allThemes.filter(
            (theme) =>
                theme.colours.themeColours.length > 0 && theme.name.length > 0
        );
        this.all.set(nonEmptyThemeArray);
    }

    getValue(value: keyof typeof this.lookupKeys) {
        // the typeof lookupKeys is suggesting that it might be undefined, but it won't be.
        // casting it to string to avoid i think a 'never' case
        const thisKey = this.lookupKeys[value] as string;
        return context.sharedStorage.get(thisKey, this[value].get());
    }

    setValue<T>(key: keyof typeof this.lookupKeys, value: T) {
        const thisKey = this.lookupKeys[key] as string;
        context.sharedStorage.set(thisKey, value);
    }

    setDefaults() {
        // Load themes from storage
        this.savedThemes = arrayStore<Theme>([]);
    }

    subscribeToAdditionalThemes() {
        debug(`subscribing to savedThemes.`);
        this.all.set([...themes, ...this.savedThemes.get()]);
        this.savedThemes.subscribe((savedThemes) => {
            debug(`savedThemes changed. adjusting ThemeController.all.`);
            this.all.set([...themes, ...savedThemes]);
        });
    }

    loadThemesFromStorage() {
        this.savedThemes = arrayStore<Theme>(
            this.getValue("savedThemes") || []
        );
    }
}
