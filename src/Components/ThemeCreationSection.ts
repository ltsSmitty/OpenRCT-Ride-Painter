import {
    box,
    compute,
    Colour,
    ArrayStore,
    arrayStore,
    colourPicker,
    button,
    horizontal,
    vertical,
    Store,
    store,
    label,
    Scale,
    toggle,
} from "openrct2-flexui";
import ThemeController from "../controllers/ThemeController";
import { debug } from "../helpers/logger";

const buttonWidth: Scale = "1w";

/**
 * Goals
 * 1. Be able to create an new arbitrary theme and pick the colours you want
 * 2. Give new theme a name
 *
 *
 */

class ThemeCreationController {
    currentColour: Store<Colour>;

    currentColourIndex: Store<number>;

    selectedColours: ArrayStore<Colour>;

    themeName: string;

    themeController: ThemeController;

    manageThemesActive: Store<boolean>;

    nameInputFields: TextInputDesc = {
        title: "Set theme name",
        description: "Choose a good theme name.",
        callback: (name) => {
            this.themeName = name;
            if (
                this.themeName.length === 0 ||
                this.selectedColours.get().length === 0
            ) {
                debug(`Attempted to save theme with a name of "${name}" and a length of ${
                    this.selectedColours.get().length
                }.
                Both need to be >0. Not able to save theme.`);
                return;
            }
            this.themeController.addNewThemeToModel({
                name: this.themeName,
                colours: { themeColours: this.selectedColours.get() },
            });
        },
    };

    constructor(tc: ThemeController) {
        this.themeController = tc;
        this.selectedColours = arrayStore<Colour>();
        this.currentColour = store<Colour>(0);
        this.currentColourIndex = store<number>(0);
        this.themeName = "";
        this.manageThemesActive = store<boolean>(false);
    }

    private getColourForIndex = (index: number) =>
        compute(this.selectedColours, (colours) => {
            if (colours[index] === undefined) return 0;
            return colours[index];
        });

    private getVisibilityforIndex = (index: number) =>
        compute(this.selectedColours, (colours) => {
            if (colours[index] === undefined) return "hidden";
            return "visible";
        });

    private generateColourPicker(index: number) {
        const element = colourPicker({
            colour: this.getColourForIndex(index),
            visibility: this.getVisibilityforIndex(index),
            onChange: (newColour) => {
                if (this.selectedColours.get()[index])
                    this.selectedColours.update(index, newColour);
            },
        });
        return element;
    }

    private generateColourPickers(startingIndex: number, endingIndex: number) {
        const acc = [];
        for (let i = startingIndex; i <= endingIndex; i += 1) {
            acc.push(this.generateColourPicker(i));
        }
        return [...acc];
    }

    private addCurrentColourToTheme() {
        // if the colour isn't already in the selectedColours[], add it
        // if it was present, print an error but don't add again
        const col = this.currentColour.get();
        if (
            this.selectedColours.get().filter((colour) => colour === col)
                .length > 0
        ) {
            // colour already exists
            debug(
                `<ThemeCreation>\t The colour ${col} is already in the theme, so it wasn't added again.`
            );
            return;
        }
        // create copy so to reduce compute()s
        const selectedColours = this.selectedColours.get();
        // add the new colour to the selected Colours
        selectedColours.push(col);
        // sort to put them back in order
        selectedColours.sort((col1, col2) => col1 - col2);
        // potentially dedupe if the colours were changed in the UI
        const uniqueColours = selectedColours.filter(
            (c, index) => selectedColours.indexOf(c) === index
        );
        debug(`<ThemeCreation>\t Adding colour ${col}`);
        // set new values
        this.selectedColours.set(uniqueColours);
    }

    private removeCurrentColourFromTheme() {
        // if the colours wasn't in, print an error but nothing to remove
        const colourIndex = this.selectedColours
            .get()
            .indexOf(this.currentColour.get());
        debug(`<ThemeCreation>\t Removing colour ${colourIndex}.`);
        if (colourIndex < 0) {
            // colour wasn't in the array, so can't be removed
            debug(
                `<ThemeCreation>\t The colour ${this.currentColour.get()} wasn't in the theme, so it can't be removed.`
            );
            return;
        }
        debug(
            `<ThemeCreation>\t selectedColours: ${JSON.stringify(
                this.selectedColours.get()
            )}; removing index ${colourIndex}`
        );
        this.selectedColours.splice(colourIndex, 1);
    }

    generateLayout() {
        const element = box({
            text: "Create a new theme",
            content: vertical({
                content: [
                    horizontal({
                        padding: { top: 6 },
                        height: 25,
                        content: [
                            // the main colour picker
                            colourPicker({
                                padding: { top: "5px" },
                                colour: 0,
                                onChange: (newColour) => {
                                    debug(
                                        `<ThemeCreation>\t colourPicker changed to ${newColour}`
                                    );
                                    this.currentColourIndex.set(newColour);
                                    this.currentColour.set(newColour);
                                },
                            }),
                            // plus button
                            button({
                                width: buttonWidth,
                                text: "Add colour",
                                onClick: () => this.addCurrentColourToTheme(),
                            }),
                            // remove button
                            button({
                                width: buttonWidth,
                                text: "Remove colour",
                                onClick: () =>
                                    this.removeCurrentColourFromTheme(),
                            }),
                        ],
                    }),
                    horizontal({
                        content: [
                            // THEME COLOUR SECTION
                            vertical({
                                spacing: 0,
                                content: [
                                    // top row
                                    horizontal({
                                        spacing: 0,
                                        content: [
                                            // first 8
                                            ...this.generateColourPickers(0, 7),
                                        ],
                                    }),
                                    horizontal({
                                        spacing: 0,
                                        content: [
                                            // second 8
                                            ...this.generateColourPickers(
                                                8,
                                                15
                                            ),
                                        ],
                                    }),
                                    horizontal({
                                        spacing: 0,
                                        content: [
                                            // third 8
                                            ...this.generateColourPickers(
                                                16,
                                                23
                                            ),
                                        ],
                                    }),
                                    horizontal({
                                        spacing: 0,
                                        content: [
                                            // fourth 8
                                            ...this.generateColourPickers(
                                                24,
                                                31
                                            ),
                                        ],
                                    }),
                                ],
                            }),
                            vertical({
                                content: [
                                    // SAVE BUTTON
                                    button({
                                        text: "Save",
                                        width: buttonWidth,
                                        height: 25,
                                        onClick: () => {
                                            ui.showTextInput(
                                                this.nameInputFields
                                            );
                                        },
                                    }),
                                    // DELETE THEME BUTTON
                                    toggle({
                                        text: "> Manage",
                                        width: buttonWidth,
                                        height: 25,
                                        onChange: (t) => {
                                            this.manageThemesActive.set(t);
                                        },
                                    }),
                                ],
                            }),
                        ],
                    }),
                    // MANAGE THEMES
                    box({
                        visibility: compute(this.manageThemesActive, (val) => {
                            if (val) return "visible";
                            return "none";
                        }),
                        content: horizontal({
                            content: [
                                label({
                                    visibility: compute(
                                        this.manageThemesActive,
                                        (val) => {
                                            if (val) return "visible";
                                            return "none";
                                        }
                                    ),
                                    text: "managing themes",
                                }),
                            ],
                        }),
                    }),
                ],
            }),
        });
        return element;
    }
}

export default ThemeCreationController;
