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

export const model = {
	// Theme data
    themes: {
        all: store<Theme[]>([]),
        selectedIndex: store<number>(0),
        selected: store<Theme | null>(null),
    },
    // Mode data
	modes: {
        all: store<Mode[]>([]),
        selectedIndex: store<number>(0),
        selected: store<Mode | null>(null),
            // twoTone mode data
            selectedTwoToneBase: store<Colour | null>(0),
    },
    // Grouping data
    groupings: {
        all: store<Grouping<number | string>[]>([]),
        selectedIndex: store<number>(0),
        selected: store<Grouping<number | string> | null> (null),
        selectedRides: store<Ride[][]>([[]]),
    },
    // Ride Selection data
    rides: {
        all: store<Ride[]>([]),
        // stores all ride types built in park
        allRideTypes: store<RideType[]>([]),
        // rides that will have the theme applied onClick()
        selected: store<Ride[]>([]),
        // displays number of rides selected e.g. "4/30 rides selected"
        selectedText: store<string>(""),
        // rides that have been painted using the plugin
        painted: store<Ride[]>([])
    },

    settings: {
        // repaint all rides at the park
        automaticPaintFrequency: store<number>(0),
        // allow RPM to repaint already themed rides
        repaintExistingRides: store<boolean>(false),
        paintBrantNewRides: store<boolean>(false)
    }

};


const subscribeColourPicker = (colourToggleIndex: Colour) => compute(model.themes.selected, theme => {
        if (theme?.colours.themeColours[colourToggleIndex]) {
            return theme.colours.themeColours[colourToggleIndex] as Colour
        }
        return 0 as Colour
    })

const subscribeColourPickerActive = (colourToggleIndex: Colour) => compute(model.themes.selected, theme => {
    if (theme?.colours.themeColours.length &&  theme.colours.themeColours.length > colourToggleIndex) return "visible"
    return "none"
})

const modeInit = () => {
	const modes: Mode[] = Modes;
	model.modes.all.set(modes);
    // todo change to reference a more global key
    model.modes.selectedIndex.set(0);
    model.modes.selected.set(model.modes.all.get()[model.modes.selectedIndex.get()]);
};

const themeInit = () => {
	model.themes.all.set(themes);
	// TODO don't reset this every time?
	model.themes.selectedIndex.set(4);
	model.themes.selected.set(model.themes.all.get()[model.themes.selectedIndex.get()]);
};

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

const groupingInit = () => {
    const groupings: Grouping<number|string>[] = Groupings;
    model.groupings.all.set(groupings);
    model.groupings.selectedIndex.set(0);
    model.groupings.selected.set(model.groupings.all.get()[model.groupings.selectedIndex.get()])
}

const settingInit = () => {

}

const colourRides = (ridesToPaint?:Ride[]) => {
	const currentTheme = model.themes.selected.get();
	const currentMode = model.modes.selected.get();
    const currentGrouping = model.groupings.selected.get();

	if (currentTheme && currentMode && currentGrouping) {
		// get all rides
		const initialRidesToTheme = (ridesToPaint) || model.rides.selected.get();

        // check if all rides should be painted, or only unpainted rides
        let finalRidesToTheme;
        if (model.settings.repaintExistingRides.get()===false) {
            finalRidesToTheme = initialRidesToTheme.filter(ride => (model.rides.painted.get().indexOf(ride)===-1))
        }
        else finalRidesToTheme = initialRidesToTheme

        // group rides together so they're painted identically
        const groupedRides = currentGrouping.applyGrouping(finalRidesToTheme);
		Object.keys(groupedRides).forEach((group, i) => {
			const cols = currentMode.applyTheme(currentTheme,
                {baseColour:model.modes.selectedTwoToneBase.get(),
                index: i});
			if (cols) {
                groupedRides[group].forEach(ride => {
                    ColourChange.setRideColour(ride, ...cols);
                    markRideAsHavingBeenPainted(ride)
                })
			}
		});
	}
};

// mark a ride as having been painted
const markRideAsHavingBeenPainted = (ride: Ride) => {
    const previouslyPaintedRides = model.rides.painted.get()
    // if the ride isn't already on the list
    if (previouslyPaintedRides.indexOf(ride)===-1)
    {
        previouslyPaintedRides.push(ride)
        model.rides.painted.set(previouslyPaintedRides);
    }
}

// eslint-disable-next-line import/prefer-default-export
export const themeWindow = window({
	title: 'Ride Paint Manager',
	width: 700,
    minWidth: 280,
    maxWidth: 900,
	height: 300,
	minHeight: 400,
	maxHeight: 800,
	padding: 8,
	onOpen: () => {
		modeInit();
		themeInit();
        rideTypeInit();
        groupingInit();
        settingInit();
	},
    onUpdate: () => {

        // Page picker text output
        const selectedRides = model.rides.selected.get();

        // set the text for number of rides selected
        model.rides.selectedText.set(`${selectedRides.length}/${model.rides.all.get().length} rides selected`)
    },
	content: [
        vertical({
            content: [
                // TOP ROW: THEME PICKER
                horizontal({
                    content:[
                        vertical({
                            width: '200px',
                            content: [
                                box({
                                    padding: 0,
                                    text: 'Pick a theme',
                                    content:
                                        vertical({
                                            spacing: 0,
                                            content: [
                                                dropdown({
                                                    height: '20px',
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
                    text: 'Pick a mode',
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
                                horizontal([
                                    label({
                                        height: 25,
                                        width: 155,
                                        alignment: 'left',
                                        text: 'Choose two-tone base colour:',
                                        visibility: compute(model.modes.selected, mode => {
                                            debug(`mode: ${JSON.stringify(mode?.name)}`)
                                            if (mode?.name==='Two-tone') return "visible";
                                            return "none"
                                            }
                                        ),
                                    }),
                                    colourPicker({
                                        colour: 0,
                                        visibility: compute(model.modes.selected, mode => {
                                            debug(`mode: ${JSON.stringify(mode?.name)}`)
                                            if (mode?.name==='Two-tone') return "visible";
                                            return "none"
                                            }
                                        ),
                                        onChange: (colourChosen:Colour) =>
                                            model.modes. selectedTwoToneBase.set(colourChosen)
                                    })
                                ]),
                                label({
                                    height: 25,
                                    padding: {top: 5},
                                    alignment: 'centred',
                                    text: compute(model.modes.selected, mode => {
                                        if (mode) return `${mode.description}`;
                                        return 'No mode selected';
                                    })
                                })
                            ]
                        })
                }),
                // THIRD ROW: GROUP BY AND SELECT RIDES
                horizontal({
                    content:[
                        // GROUP PICKER
                        box({
                            text: 'Group by',
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
                                            height: 75,
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
                // RIDE TYPE SELECTION
                vertical([
                    box({
                        text: 'Select Rides',
                        content:
                            vertical({
                                spacing: 10,
                                // padding: 5
                                content: [
                                    // Top row of view
                                    horizontal({
                                        height: 25,
                                        padding: 10,
                                        spacing: 5,
                                        content: [
                                            // toggle to Select all rides
                                            button({
                                                onClick: () => {
                                                    if (model.rides.selected.get().length === model.rides.all.get().length) {
                                                        model.rides.selected.set([]);
                                                    }
                                                    else {
                                                        model.rides.selected.set(model.rides.all.get());
                                                    }
                                                },
                                                text: 'Select/Deselect all rides'
                                            }),
                                            label({
                                                padding: {top: 5},
                                                text: model.rides.selectedText,
                                            }),
                                        ]

                                    }),
                                    // Select a type
                                    label({
                                        padding: {top: 5},
                                        text: "Select a type:",
                                    }),
                                    dropdown({
                                        width: 200,
                                        padding: {top: 5},
                                        items: compute(model.rides.allRideTypes, rideType => rideType.map(type =>
                                                // Display the ride type and the number of those rides
                                                    `${RideType[type]} - ${model.rides.all.get().filter(ride=>ride.type===type).length}`
                                            )),
                                        onChange: (typeIndex) => {
                                            const ridesOfThisType = model.rides.all.get().filter(ride=>ride.type===model.rides.allRideTypes.get()[typeIndex])
                                            model.rides.selected.set(ridesOfThisType)
                                        }
                                    }),
                                ]
                            })
                    })
                ]),
                // SETTINGS
                horizontal({
                    content:[
                        box({
                            text: "Settings",
                            content:
                                vertical({
                                    content:[
                                        horizontal({
                                            width: 300,
                                            content:[
                                                label({
                                                    padding: {top: 2},
                                                    text: "Auto-paint selected rides:",
                                                    alignment: "left"
                                                }),
                                                dropdownSpinner({
                                                    items: ["never", "daily", "weekly", "monthly", "yearly"],
                                                    onChange: (index: number) => model.settings.automaticPaintFrequency.set(index),
                                                })
                                            ]
                                        }),
                                        toggle({
                                            isPressed: false,
                                            text: "Allow repainting of already painted rides",
                                            onChange: (isPressed:boolean) => model.settings.repaintExistingRides.set(isPressed),

                                        }),
                                        toggle({
                                            text: "Paint newly built rides automatically",
                                            onChange: (isPressed:boolean) => model.settings.paintBrantNewRides.set(isPressed),
                                        })
                                    ]
                            }),
                        }),
                    ]
                }),
                button({
                    text: 'Paint rides',
                    disabled: compute(model.rides.selected , (rides) => rides.length<=0),
                    onClick: () => colourRides(),
                }),
            ]
        })]
    })


function onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }

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
        debug(`paintFrequency: ${paintFrequency}`)
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
