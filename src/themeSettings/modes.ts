/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import { Colour } from "openrct2-flexui";
import { debug } from "../helpers/logger";
import { Theme, RideColours } from "./themes";

const getRandomColour = (colours: number[]) =>
    colours[Math.floor(Math.random() * colours.length)];

export interface Mode {
    readonly name: string;
    description: string;
    applyTheme(
        theme: Theme,
        options?: {
            customColours?: Colour[];
            index?: number;
            naturalSupports?: boolean;
        }
    ): RideColours | null;
}

const monoChromaticMode: Mode = {
    name: "Monochromatic ride & track",
    description: "{BLACK}Paint the ride & cars in one solid colour.",
    applyTheme(theme: Theme) {
        if (theme.colours.themeColours) {
            const c = getRandomColour(theme.colours.themeColours);
            return [c, c, c, c, c, c] as RideColours;
        }
        return null;
    },
};

const randomMode: Mode = {
    name: "Random colours",
    description:
        "{BLACK}Paint each track and car piece in random colours from the theme palette.",
    applyTheme(theme: Theme) {
        if (theme.colours.themeColours) {
            const colours = [
                getRandomColour(theme.colours.themeColours),
                getRandomColour(theme.colours.themeColours),
                getRandomColour(theme.colours.themeColours),
                getRandomColour(theme.colours.themeColours),
                getRandomColour(theme.colours.themeColours),
                getRandomColour(theme.colours.themeColours),
            ];

            return colours as RideColours;
        }
        return null;
    },
};

const customPatternMode: Mode = {
    name: "Custom pattern",
    description: `{BLACK}Paint the enabled ride parts with your chosen colour; otherwise fill from palette.`,
    /**
     *
     * @param theme contains a colour palette
     * @param options.customColours contains the custom pattern as a RideColour[]
     * Track parts that are active to be painted will have their colour value,
     * Track parts deactived will be -1.
     * e.g. a custom pattern with track main and car main enabled and set to dark purple will be
     * [3, -1, -1, 3, -1, -1]
     * @returns a RideColour to paint
     */
    applyTheme(
        theme: Theme,
        options: {
            customColours: Colour[];
            twoTone?: boolean;
        }
    ) {
        if (theme.colours.themeColours) {
            // choose a random base colour from the theme
            // if twoTone enabled, set base colour array to one base colour
            // if twoTone disbled, set the base colour to random palette colours
            let baseColourArray: number[] = new Array(6);
            if (options.twoTone) {
                const col = getRandomColour(theme.colours.themeColours);
                baseColourArray = [col, col, col, col, col, col];
            } else {
                for (let i = 0; i < 6; i += 1) {
                    baseColourArray[i] = getRandomColour(
                        theme.colours.themeColours
                    );
                }
            }
            // loop through the given customColours
            // any that were active (value >= 0) will paint that piece
            // otherwise it'll paint the base colour
            const ret = new Array(6);
            for (let i = 0; i < 6; i += 1) {
                ret[i] =
                    options.customColours[i] >= 0
                        ? options.customColours[i]
                        : baseColourArray[i];
            }
            return ret as RideColours;
        }
        return null;
    },
};

const buildOrderMode: Mode = {
    name: "Build order",
    description: `{BLACK}Paint rides in the order they were built. Goes especially well with the 'Rainbow' theme and selecting a ride type you have multiple of.`,
    applyTheme(theme: Theme, options: { index: number }) {
        const { index } = options;
        if (theme.colours.partColours) {
            const ret = [
                theme.colours.partColours.trackColourMain[
                    index % theme.colours.partColours.trackColourMain.length
                ],
                theme.colours.partColours.trackColourAdditional[
                    index %
                        theme.colours.partColours.trackColourAdditional.length
                ],
                theme.colours.partColours.trackColourSupports[
                    index % theme.colours.partColours.trackColourSupports.length
                ],
                theme.colours.partColours.VehicleColourBody[
                    index % theme.colours.partColours.VehicleColourBody.length
                ],
                theme.colours.partColours.VehicleColourTrim[
                    index % theme.colours.partColours.VehicleColourTrim.length
                ],
                theme.colours.partColours.VehicleColourTernary[
                    index %
                        theme.colours.partColours.VehicleColourTernary.length
                ],
            ];
            return ret as RideColours;
        }
        if (theme.colours.themeColours) {
            const c =
                theme.colours.themeColours[
                    index % theme.colours.themeColours.length
                ];
            return [c, c, c, c, c, c] as RideColours;
        }
        return null;
    },
};

const shuffleMode: Mode = {
    name: "Shuffle",
    description: `{BLACK}Shuffle and choose a random of the other painting modes.`,
    applyTheme(
        theme: Theme,
        options: {
            index?: number;
            customColours?: Colour[];
        }
    ) {
        const r = Math.floor(context.getRandom(0, 4));
        // eslint-disable-next-line no-use-before-define
        const chosenMode = getMode(r);
        return chosenMode.applyTheme(theme, options);
    },
};

export const modes: Mode[] = [
    monoChromaticMode,
    randomMode,
    buildOrderMode,
    customPatternMode,
    shuffleMode,
];

export const getMode = (selected: number) => modes[selected];
