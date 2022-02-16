/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
/// <reference path="../lib/openrct2.d.ts" />

import { box, button, compute, colourPicker ,dropdown, horizontal, label, dropdownSpinner,
    store, window, vertical, toggle, Colour } from 'openrct2-flexui';
import { Mode, Modes } from './modes';
import { Theme, themes } from './themes';
import { debug } from './helpers/logger';
import ColourChange from './ColourChange';
import { RideType } from './RideType';
import { Grouping, Groupings } from './groupings';


/**
 * Record the model information inside of stores so the values can be read/updated by the UI
 */
export const model = {
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
/**
 * Helper for 'Custom Pattern' mode. Combine the selected colours & widget active state to know what to paint and return a Colour[]
 */
const combineCustomColourArrays = (): Colour[] => {
    const colours = model.modes.selectedCustomColours.get();
    const enabledArr = model.modes.selectedColoursEnabled.get();
    const ret = [];
    for (let i=0; i<colours.length;i+=1) {
        ret[i] = (enabledArr[i] ? colours[i] : -1)
    }
    return ret;

}
/**
 * Helper for the theme section colourPickers to compute what colour to display
 */
const subscribeColourPicker = (colourToggleIndex: Colour) => compute(model.themes.selected, theme => {
        if (theme?.colours.themeColours[colourToggleIndex]) {
            return theme.colours.themeColours[colourToggleIndex] as Colour
        }
        return 0 as Colour
    })

/**
 * Helper for theme section colourPickers to compute whether to display or be invisible
 */
const subscribeColourPickerActive = (colourToggleIndex: Colour) => compute(model.themes.selected, theme => {
    if (theme?.colours.themeColours.length &&  theme.colours.themeColours.length > colourToggleIndex) return "visible"
    return "none"
})

/**
 * Run on game load to set up initial plugin settings
 */
export const initPluginSettings = () => {
    /**
     * Initializes mode data into the store. Checks the game's config to persist from one load to another
     */
    const modeInit = () => {
        const modes: Mode[] = Modes;
        model.modes.all.set(modes);
        model.modes.selectedIndex.set(0);
        model.modes.selected.set(model.modes.all.get()[model.modes.selectedIndex.get()]);
        model.modes.selectedCustomColours.set([0, 0, 0, 0, 0, 0]);
        model.modes.selectedColoursEnabled.set([true, false, true, true, false, true,]);
    };

    /**
     * Initializes theme data into the store. Checks the game's config to persist from one load to another
     */
    const themeInit = () => {
        // only needed once per game load
        model.themes.all.set(themes);
        // only needed once per game load
        model.themes.selectedIndex.set(0);
        // only needed once per game load
        model.themes.selected.set(model.themes.all.get()[model.themes.selectedIndex.get()]);
    };

    /**
     * Initializes ride data into the store. Checks the game's config to persist from one load to another
     */
    const rideTypeInit = () => {
        // get rides from map and set to model.rides.all
        const allRides=map.rides.filter(ride => ride.classification === 'ride')
        model.rides.all.set(allRides)

        const allRideTypes = allRides.map(ride => ride.type);
        const uniqueRideTypes = allRideTypes
            // get the unique ride types
            .filter(onlyUnique)
            // get only non-zero/truthy values
            .filter( n => n);
        model.rides.allRideTypes.set(uniqueRideTypes);

    }

    /**
     * Initializes grouping data into the store. Checks the game's config to persist from one load to another
     */
    const groupingInit = () => {
        const groupings: Grouping<number|string>[] = Groupings;
        model.groupings.all.set(groupings);
        model.groupings.selectedIndex.set(0);
        model.groupings.selected.set(model.groupings.all.get()[model.groupings.selectedIndex.get()])
    }

    /**
     * Initializes settings data into the store. Checks the game's config to persist from one load to another
     */
    const settingInit = () => {
        model.settings.repaintExistingRides.set(true);
    }
    modeInit();
    themeInit();
    rideTypeInit();
    groupingInit();
    settingInit();
}

/**
 * Apply the selected theme, mode and grouping to rides in park.
 * Applies to @param ridesToPaint if given; otherwise applies to model.rides.selected
 */
const colourRides = (ridesToPaint?:Ride[]) => {
	const currentTheme = model.themes.selected.get();
	const currentMode = model.modes.selected.get();
    const currentGrouping = model.groupings.selected.get();

	// guard to make sure there's a theme, mode and grouping.
    if (!(currentTheme && currentMode && currentGrouping)) return;

    // get rides to theme
    const initialRidesToTheme = (ridesToPaint) || model.rides.selected.get();

    // check if all rides should be painted, or only unpainted rides
    let finalRidesToTheme;
    if (model.settings.repaintExistingRides.get()===false) {
        finalRidesToTheme = initialRidesToTheme.filter(ride => (model.rides.painted.get().indexOf(ride)===-1))
    }
    else finalRidesToTheme = initialRidesToTheme

    // group rides together so they're painted identically
    const groupedRides = currentGrouping.applyGrouping(finalRidesToTheme);

    // for each group of rides
    Object.keys(groupedRides).forEach((group, i) => {
        // get the 6 ride colours based on the theme and mode
        const colours = currentMode.applyTheme(currentTheme,{
            customColours: combineCustomColourArrays() as Colour[],
            index: i
        });
        // guard to make sure there are some colours
        if (!colours) return;

        // apply the colour to each ride
        groupedRides[group].forEach(ride => {
            // If it's a maze, the maze theme type only looks at cols[2]. If that is >3, the maze bugs out
            // Need to make sure it's not that before moving on
            if (ride.type === 20 && colours[2]>3) return

            // Actually do the painting!
            ColourChange.setRideColour(ride, ...colours);
            markRideAsHavingBeenPainted(ride)
        })

    });
    // todo disable button if rides can't be repainted

};

/**
 * Mark a ride as having been painted.
 * Prevents the ride from being repainted if 'Allow repainting of already painted rides' is disabled.
 */
const markRideAsHavingBeenPainted = (ride: Ride) => {
    const previouslyPaintedRides = model.rides.painted.get()
    // if the ride isn't already on the list
    if (previouslyPaintedRides.indexOf(ride)===-1)
    {
        previouslyPaintedRides.push(ride)
        model.rides.painted.set(previouslyPaintedRides);
    }
}

/**
 * Helper for 'Custom Pattern' mode. Flip the active state of the colourPicker widgets onClick/onChange
 */
const enableRideColourPicker = (index:number) => {
    const enabledColours = model.modes.selectedColoursEnabled.get()
    enabledColours[index] = !enabledColours[index]
    model.modes.selectedColoursEnabled.set(enabledColours);
}

export const themeWindow = window({
	title: 'Ride Painter',
    width: 400,
	height: 540,
    spacing: 10,
	padding: 8,
    colours: [1,24],
	onOpen: () => {},
    onUpdate: () => {
        // Page picker text output
        const selectedRides = model.rides.selected.get();
        // set the text for number of rides selected
        model.rides.selectedText.set(`{BLACK}${selectedRides.length}/${model.rides.all.get().length} rides selected`)
    },
	content: [
            // TOP ROW: THEME PICKER
            horizontal({
                height: 85,
                content:[
                    vertical({
                        width: '200px',
                        content: [
                            box({
                                text: '1. Pick a theme',
                                content:
                                    vertical({
                                        spacing: 0,
                                        content: [
                                            dropdown({
                                                items: compute(model.themes.all, (t) => t.map((theme) => theme.name)),
                                                selectedIndex: model.themes.selectedIndex,
                                                disabled: compute(model.themes.all, (t) => t.length === 0),
                                                disabledMessage: 'No themes defined.',
                                                onChange: (index: number) => {
                                                    model.themes.selectedIndex.set(index);
                                                    model.themes.selected.set(model.themes.all.get()[index]);
                                                }
                                            }),
                                            // first row of theme colours
                                            horizontal({
                                                spacing: 0,
                                                content:[
                                                colourPicker({
                                                    colour: subscribeColourPicker(0),
                                                    visibility: subscribeColourPickerActive(0),
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(1),
                                                    visibility: subscribeColourPickerActive(1),
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(2),
                                                    visibility: subscribeColourPickerActive(2),
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(3),
                                                    visibility: subscribeColourPickerActive(3),
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(4),
                                                    visibility: subscribeColourPickerActive(4),
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(5),
                                                    visibility: subscribeColourPickerActive(5),
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(6),
                                                    visibility: subscribeColourPickerActive(6),
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(7),
                                                    visibility: subscribeColourPickerActive(7),
                                                }),
                                            ]}),
                                            // second row of theme colours
                                            horizontal({
                                                spacing: 0,
                                                content:[
                                                // a bunch of colour pickers to show the theme colours
                                                // 0th colour picker
                                                colourPicker({
                                                    colour: subscribeColourPicker(8),
                                                    visibility: subscribeColourPickerActive(8),
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(9),
                                                    visibility: subscribeColourPickerActive(9),
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(10),
                                                    visibility: subscribeColourPickerActive(10),
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(11),
                                                    visibility: subscribeColourPickerActive(11),
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(12),
                                                    visibility: subscribeColourPickerActive(12),
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(13),
                                                    visibility: subscribeColourPickerActive(13),
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(14),
                                                    visibility: subscribeColourPickerActive(14),
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(15),
                                                    visibility: subscribeColourPickerActive(15),
                                                }),
                                            ]}),

                                            // third row
                                            horizontal({
                                                spacing: 0,
                                                content: [
                                                colourPicker({
                                                    colour: subscribeColourPicker(16),
                                                    visibility: subscribeColourPickerActive(16)
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(17),
                                                    visibility: subscribeColourPickerActive(17)
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(18),
                                                    visibility: subscribeColourPickerActive(18)
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(19),
                                                    visibility: subscribeColourPickerActive(19)
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(20),
                                                    visibility: subscribeColourPickerActive(20)
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(21),
                                                    visibility: subscribeColourPickerActive(21)
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(22),
                                                    visibility: subscribeColourPickerActive(22)
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(23),
                                                    visibility: subscribeColourPickerActive(23)
                                                }),
                                            ]}),
                                            // fourth row
                                            horizontal({
                                                spacing: 0,
                                                content: [
                                                colourPicker({
                                                    colour: subscribeColourPicker(24),
                                                    visibility: subscribeColourPickerActive(24)
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(25),
                                                    visibility: subscribeColourPickerActive(25)
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(26),
                                                    visibility: subscribeColourPickerActive(26)
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(27),
                                                    visibility: subscribeColourPickerActive(27)
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(28),
                                                    visibility: subscribeColourPickerActive(28)
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(29),
                                                    visibility: subscribeColourPickerActive(29)
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(30),
                                                    visibility: subscribeColourPickerActive(30)
                                                }),
                                                colourPicker({
                                                    colour: subscribeColourPicker(31),
                                                    visibility: subscribeColourPickerActive(31)
                                                }),
                                            ]})
                                        ]
                                    })
                                }),

                            ]

                        }),
                ]
            }),
            // SECOND ROW: MODE PICKER
            box({
                text: '2. Pick a painting mode',
                height: 100,
                // padding:{bottom:5},
                content:
                    vertical({
                        padding: 5,
                        spacing: 10,
                        content: [
                            dropdown({
                                padding: {top:5},
                                items: compute(model.modes.all, (modes) => modes.map((mode)=>mode.name)),
                                selectedIndex: model.modes.selectedIndex,
                                disabled: compute(model.modes.all, m => m.length === 0),
                                disabledMessage: 'No modes defined',
                                onChange: (index:number) => {
                                    model.modes.selectedIndex.set(index);
                                    model.modes.selected.set(model.modes.all.get()[index]);
                                }
                            }),
                            label({
                                // height: 25,
                                padding: {top: 5},
                                alignment: 'centred',
                                text: compute(model.modes.selected, mode => {
                                    if (mode) return `${mode.description}`;
                                    return 'No mode selected';
                                })
                            }),
                            // COLOUR PICKERS
                            horizontal([
                                // track main
                                colourPicker({
                                    padding: {left: "40%"},
                                    width: "1w",
                                    colour: 0,
                                    disabled: compute(model.modes.selectedColoursEnabled, enabledColours => !enabledColours[0]),
                                    visibility: compute(model.modes.selected, mode => {
                                        if (mode?.name==='Custom pattern') return "visible";
                                        return "none"
                                        }
                                    ),
                                    onChange: (colourChosen:Colour) =>{
                                        const currentSelectedColours = model.modes.selectedCustomColours.get();
                                        currentSelectedColours[0]=colourChosen;
                                        model.modes.selectedCustomColours.set(currentSelectedColours)
                                    }
                                }),
                                // track additional
                                colourPicker({
                                    padding: {left: "40%"},
                                    width: "1w",
                                    colour: 0,
                                    disabled: compute(model.modes.selectedColoursEnabled, enabledColours => !enabledColours[1]),
                                    visibility: compute(model.modes.selected, mode => {
                                        if (mode?.name==='Custom pattern') return "visible";
                                        return "none"
                                        }
                                    ),
                                    onChange: (colourChosen:Colour) =>{
                                        const currentSelectedColours = model.modes.selectedCustomColours.get();
                                        currentSelectedColours[1]=colourChosen;
                                        model.modes.selectedCustomColours.set(currentSelectedColours)
                                    }
                                }),
                                // track supports
                                colourPicker({
                                    padding: {left: "40%"},
                                    width: "1w",
                                    colour: 0,
                                    disabled: compute(model.modes.selectedColoursEnabled, enabledColours => !enabledColours[2]),
                                    visibility: compute(model.modes.selected, mode => {
                                        if (mode?.name==='Custom pattern') return "visible";
                                        return "none"
                                        }
                                    ),
                                    onChange: (colourChosen:Colour) =>{
                                        const currentSelectedColours = model.modes.selectedCustomColours.get();
                                        currentSelectedColours[2]=colourChosen;
                                        model.modes.selectedCustomColours.set(currentSelectedColours)
                                    }
                                }),
                                // car main
                                colourPicker({
                                    padding: {left: "40%"},
                                    width: "1w",
                                    colour: 0,
                                    disabled: compute(model.modes.selectedColoursEnabled, enabledColours => !enabledColours[3]),
                                    visibility: compute(model.modes.selected, mode => {
                                        if (mode?.name==='Custom pattern') return "visible";
                                        return "none"
                                        }
                                    ),
                                    onChange: (colourChosen:Colour) =>{
                                        const currentSelectedColours = model.modes.selectedCustomColours.get();
                                        currentSelectedColours[3]=colourChosen;
                                        model.modes.selectedCustomColours.set(currentSelectedColours)
                                    }
                                }),
                                // car trim
                                colourPicker({
                                    padding: {left: "40%"},
                                    width: "1w",
                                    colour: 0,
                                    disabled: compute(model.modes.selectedColoursEnabled, enabledColours => !enabledColours[4]),
                                    visibility: compute(model.modes.selected, mode => {
                                        if (mode?.name==='Custom pattern') return "visible";
                                        return "none"
                                        }
                                    ),
                                    onChange: (colourChosen:Colour) =>{
                                        const currentSelectedColours = model.modes.selectedCustomColours.get();
                                        currentSelectedColours[4]=colourChosen;
                                        model.modes.selectedCustomColours.set(currentSelectedColours)
                                    }
                                }),
                                // car tertiary
                                colourPicker({
                                    padding: {left: "40%"},
                                    width: "1w",
                                    colour: 0,
                                    disabled: compute(model.modes.selectedColoursEnabled, enabledColours => !enabledColours[5]),
                                    visibility: compute(model.modes.selected, mode => {
                                        if (mode?.name==='Custom pattern') return "visible";
                                        return "none"
                                        }
                                    ),
                                    onChange: (colourChosen:Colour) =>{
                                        const currentSelectedColours = model.modes.selectedCustomColours.get();
                                        currentSelectedColours[5]=colourChosen;
                                        model.modes.selectedCustomColours.set(currentSelectedColours)
                                    }
                                }),
                            ]),
                            // TOGGLES TO ENABLE/DISABLE COLOUR PICKERS
                            horizontal({
                                height: 20,
                                content: [
                                    toggle({
                                        text: "{BLACK}Track main",
                                        isPressed: compute(model.modes.selectedColoursEnabled, enabledColours => enabledColours[0]),
                                        onChange: () => enableRideColourPicker(0),
                                        visibility: compute(model.modes.selected, mode => {
                                            if (mode?.name==='Custom pattern') return "visible";
                                            return "none"
                                            }
                                        ),
                                    }),
                                    toggle({
                                        text: "{BLACK}Track add'l",
                                        isPressed: compute(model.modes.selectedColoursEnabled, enabledColours => enabledColours[1]),
                                        onChange: () => enableRideColourPicker(1),
                                        visibility: compute(model.modes.selected, mode => {
                                            if (mode?.name==='Custom pattern') return "visible";
                                            return "none"
                                            }
                                        ),
                                    }),
                                    toggle({
                                        text: "{BLACK}Track sups",
                                        isPressed: compute(model.modes.selectedColoursEnabled, enabledColours => enabledColours[2]),
                                        onChange: () => enableRideColourPicker(2),
                                        visibility: compute(model.modes.selected, mode => {
                                            if (mode?.name==='Custom pattern') return "visible";
                                            return "none"
                                            }
                                        ),
                                    }),
                                    toggle({
                                        text: "{BLACK}Car main",
                                        isPressed: compute(model.modes.selectedColoursEnabled, enabledColours => enabledColours[3]),
                                        onChange: () => enableRideColourPicker(3),
                                        visibility: compute(model.modes.selected, mode => {
                                            if (mode?.name==='Custom pattern') return "visible";
                                            return "none"
                                            }
                                        ),
                                    }),
                                    toggle({
                                        text: "{BLACK}Car trim",
                                        isPressed: compute(model.modes.selectedColoursEnabled, enabledColours => enabledColours[4]),
                                        onChange: () => enableRideColourPicker(4),
                                        visibility: compute(model.modes.selected, mode => {
                                            if (mode?.name==='Custom pattern') return "visible";
                                            return "none"
                                            }
                                        ),
                                    }),
                                    toggle({
                                        text: "{BLACK}Car add'l",
                                        isPressed: compute(model.modes.selectedColoursEnabled, enabledColours => enabledColours[5]),
                                        onChange: () => enableRideColourPicker(5),
                                        visibility: compute(model.modes.selected, mode => {
                                            if (mode?.name==='Custom pattern') return "visible";
                                            return "none"
                                            }
                                        ),
                                    }),
                                ]
                            })
                        ]
                    })
            }),
            // THIRD ROW: GROUP BY
            horizontal({
                height: 80,
                content:[
                    // GROUP PICKER
                    box({
                        text: '3. Paint rides together by group: (optional)',
                        content:
                            vertical({
                                padding: 5,
                                spacing: 10,
                                content: [
                                    dropdown({
                                        padding: {top: 5},
                                        items: compute(model.groupings.all, (groupings) => groupings.map((grouping)=>grouping.name)),
                                        selectedIndex: model.groupings.selectedIndex,
                                        disabled: compute(model.groupings.all, m => m.length === 0),
                                        disabledMessage: 'No groupings defined',
                                        onChange: (index:number) => {
                                            model.groupings.selectedIndex.set(index);
                                            model.groupings.selected.set(model.groupings.all.get()[index]);
                                        }
                                    }),
                                    label({
                                    //     height: 75,
                                        padding: {top: 10},
                                        alignment: 'centred',
                                        text: compute(model.groupings.selected, grouping => {
                                            if (grouping) return `${grouping.description}`;
                                            return 'No mode selected';
                                        })
                                    })
                                ]
                            })
                    }),
                ]
            }),
            // FOURTH ROW: RIDE/TYPE SELECTION
            vertical([
                box({
                    height: 75,
                    text: '4. Select rides to paint',
                    content:
                        vertical({
                            content: [
                                // Select a type
                                dropdown({
                                    padding: {top:5},
                                    selectedIndex: compute(model.rides.selectedIndex, index=> index),
                                    items: compute(model.rides.allRideTypes, rideType => rideType.map(type =>
                                            // Display the ride type and the number of those rides
                                                `${RideType[type]} - ${model.rides.all.get().filter(ride=>ride.type===type).length}`
                                        )),
                                    onChange: (typeIndex) => {
                                        const ridesOfThisType = model.rides.all.get().filter(ride=>ride.type===model.rides.allRideTypes.get()[typeIndex])
                                        model.rides.selected.set(ridesOfThisType)
                                        model.rides.selectedIndex.set(typeIndex)
                                    }
                                }),
                                label({
                                    padding: {top:5},
                                    text: "{BLACK}Or select all rides:",
                                }),
                                horizontal({
                                    height: 20,
                                    content: [
                                        // button to Select all rides
                                        button({
                                            width: "67%",
                                            onClick: () => {
                                                if (model.rides.selected.get().length === model.rides.all.get().length) {
                                                    model.rides.selected.set([]);
                                                }
                                                else {
                                                    model.rides.selected.set(model.rides.all.get());
                                                }
                                            },
                                            text: '{BLACK}Select/Deselect all rides'
                                        }),
                                        label({
                                            padding: {top: 5},
                                            text: model.rides.selectedText,
                                        }),
                                    ]

                                }),
                            ]
                        })
                })
            ]),
            // SETTINGS
            horizontal({
                content:[
                    box({
                        text: "5. Other settings",
                        content:
                            vertical({
                                content:[
                                    horizontal({
                                    //    width: 300,
                                        content:[
                                            label({

                                                padding: {top: 2},
                                                text: "{BLACK}Auto-paint selected rides:",
                                                alignment: "left"
                                            }),
                                            dropdownSpinner({
                                                items: ["never", "daily", "weekly", "monthly", "yearly"],
                                                onChange: (index: number) => model.settings.automaticPaintFrequency.set(index),
                                            })
                                        ]
                                    }),
                                    toggle({
                                        height: 20,
                                        isPressed: true,
                                        text: "{BLACK}Allow repainting of already painted rides",
                                        onChange: (isPressed:boolean) => model.settings.repaintExistingRides.set(isPressed),

                                    }),
                                    toggle({
                                        height: 20,
                                        text: "{BLACK}Paint newly built rides automatically",
                                        onChange: (isPressed:boolean) => model.settings.paintBrantNewRides.set(isPressed),
                                    })
                                ]
                        }),
                    }),
                ]
            }),
            button({
                height: 30,
                padding: [5,"10%"],
                text: '6. Paint selected rides',
                disabled: compute(model.rides.selected , (rides) => rides.length<=0),
                onClick: () => colourRides(),
                tooltip: "Nothing changing? Make sure to enable 'Allow repainting of already painted rides'"
            }),
        ]
    })

/**
 * Helper to get unique ride types
 */
function onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }

  /**
   * Runs daily.
   * 1. Paint brand new rides if that option is seleced
   * 2. Repaint daily/weekly/monthly/annually based on store setting.
   */
export const dailyUpdate = () => {

    // PAINT NEW RIDES BASED ON paintBrantNewRides === true
        const allRides = map.rides.filter(ride=>ride.classification==="ride")
        model.rides.all.set(allRides);
        const paintedRides = model.rides.painted.get()
        // should new rides be painted automatically?
        if (model.settings.paintBrantNewRides.get()) {
            const ridesToPaint = allRides.filter(ride => (paintedRides.indexOf(ride)===-1))
            if (ridesToPaint.length>0) colourRides(ridesToPaint);
        }


    // PAINT RIDES BASED ON AUTOMATIC PAINT FREQUENCY
        //  values: ["never", "daily", "weekly", "monthly", "yearly"],
        const paintFrequency = model.settings.automaticPaintFrequency.get();
        // if set to never, return
        if (paintFrequency===0) return;

        // if set to annual, check that month = 0 and day = 1 before painting
        if (paintFrequency === 4 && date.month === 0 && date.day === 1) {
            colourRides();
            return;
        }
        // if set to monthly, check that day = 1 before painting
        if (paintFrequency === 3 && date.day === 1) {
            colourRides();
            return;
        }
        // if set to weekly, check if the day remainder is 1 (will change on the 1, 8, 15, 22, 29 of the month)
        if (paintFrequency === 2 && date.day%7===1) {
            colourRides();
            return;
        }
        // if set to daily
        if (paintFrequency === 1) colourRides()
}

