/* eslint-disable max-len */
/// <reference path="../lib/openrct2.d.ts" />

// eslint-disable-next-line import/no-extraneous-dependencies
import { box, button, compute, colourPicker ,dropdown, horizontal, label,
    store, window, vertical, toggle, Colour } from 'openrct2-flexui';
import { Mode, Modes } from './modes';
import { Theme, themes } from './themes';
import { debug } from './helpers/logger';
import ColourChange from './ColourChange';
import { RideType } from './RideType';
import { Grouping, Groupings } from './groupings';

export const model = {
	// Theme data
	allThemes: store<Theme[]>([]),
	selectedThemeIndex: store<number>(0),
	selectedTheme: store<Theme | null>(null),

	// Mode data
	allModes: store<Mode[]>([]),
	selectedModeIndex: store<number>(0),
	selectedMode: store<Mode | null>(null),
        // twoTone mode data
        selectedTwoToneBase: store<Colour | null>(0),

    // Grouping data
    allGroupings: store<Grouping<number | string>[]>([]),
    selectedGroupingIndex: store<number>(0),
    selectedGrouping: store<Grouping<number | string> | null> (null),
    selectedGroupedRides: store<Ride[][]>([[]]),

    // Ride Selection data
    allRides: store<Ride[]>([]),
    allRideTypes: store<RideType[]>([]),
    // rides that will have the theme applied onClick()
    selectedRides: store<Ride[]>([]),
    selectedRidesText: store<string>(""),

    // Selections
    allSelections: store<Grouping<number | string>[]>([]),
    selectedSelections: store<Grouping<number | string> | null> (null),
    selectedSelectionsIndex: store<number>(0)

};


const subscribeColourPicker = (colourToggleIndex: Colour) => compute(model.selectedTheme, theme => {
        if (theme?.colours.themeColours[colourToggleIndex]) {
            return theme.colours.themeColours[colourToggleIndex] as Colour
        }
        return 0 as Colour
    })

const subscribeColourPickerActive = (colourToggleIndex: Colour) => compute(model.selectedTheme, theme => {
    if (theme?.colours.themeColours.length &&  theme.colours.themeColours.length > colourToggleIndex) return "visible"
    return "none"
})

const modeInit = () => {
	const modes: Mode[] = Modes;
	model.allModes.set(modes);
    model.selectedModeIndex.set(0);
    model.selectedMode.set(model.allModes.get()[model.selectedModeIndex.get()]);
};

const themeInit = () => {
	model.allThemes.set(themes);
	// TODO don't reset this every time?
	model.selectedThemeIndex.set(4);
	model.selectedTheme.set(model.allThemes.get()[model.selectedThemeIndex.get()]);
};

const rideTypeInit = () => {
    // get rides from map and set to model.allRides
    const allRides=map.rides.filter(ride => ride.classification === 'ride')
    model.allRides.set(allRides)

    const allRideTypes = allRides.map(ride => ride.type);
    const uniqueRideTypes = allRideTypes
        // get the unique ride types
        .filter(onlyUnique)
        // get only non-zero/truthy values
        .filter( n => n);
    model.allRideTypes.set(uniqueRideTypes);
}

const groupingInit = () => {
    const groupings: Grouping<number|string>[] = Groupings;
    model.allGroupings.set(groupings);
    model.selectedGroupingIndex.set(0);
    model.selectedGrouping.set(model.allGroupings.get()[model.selectedGroupingIndex.get()])
}

const colourRides = () => {
	const currentTheme = model.selectedTheme.get();
	const currentMode = model.selectedMode.get();
    const currentGrouping = model.selectedGrouping.get();

	if (currentTheme && currentMode && currentGrouping) {
		// get all rides
		const ridesToTheme = model.selectedRides.get();
        const groupedRides = currentGrouping.applyGrouping(ridesToTheme);
		Object.keys(groupedRides).forEach((group, i) => {
			const cols = currentMode.applyTheme(currentTheme,
                {baseColour:model.selectedTwoToneBase.get(),
                index: i});
			if (cols) {
                groupedRides[group].forEach(ride => {
                    ColourChange.setRideColour(ride, ...cols);
                })
			}
		});
        model.selectedRides.set(ridesToTheme)
	}
};

// eslint-disable-next-line import/prefer-default-export
export const themeWindow = window({
	title: 'ToggleTest',
	width: 700,
    minWidth: 280,
    maxWidth: 900,
	height: 300,
	minHeight: 400,
	maxHeight: 500,
	padding: 8,
	onOpen: () => {
		modeInit();
		themeInit();
        rideTypeInit();
        groupingInit();
	},
    onUpdate: () => {

        // Page picker text output
        const selectedRides = model.selectedRides.get();

        // set the text for number of rides selected
        model.selectedRidesText.set(`${selectedRides.length}/${model.allRides.get().length} rides selected`)
    },
	content: [
        horizontal({
                content: [
                    // Mode/Theme picker section
                    vertical({
                        width: '200px',
                        content: [
                            // theme selection
                            box({
                                padding: 0,
                                text: 'Pick a theme',
                                content:
                                    vertical({

                                        spacing: 0,
                                        content: [
                                            dropdown({
                                                height: '20px',
                                                items: compute(model.allThemes, (t) => t.map((theme) => theme.name)),
                                                selectedIndex: model.selectedThemeIndex,
                                                disabled: compute(model.allThemes, (t) => t.length === 0),
                                                disabledMessage: 'No themes defined.',
                                                onChange: (index: number) => {
                                                    model.selectedThemeIndex.set(index);
                                                    model.selectedTheme.set(model.allThemes.get()[index]);
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
                            // mode selection
                            box({
                                text: 'Pick a mode',
                                content:
                                    vertical({
                                        padding: 5,
                                        spacing: 10,
                                        content: [
                                            dropdown({
                                                padding: {top:5},
                                                items: compute(model.allModes, (modes) => modes.map((mode)=>mode.name)),
                                                selectedIndex: model.selectedModeIndex,
                                                disabled: compute(model.allModes, m => m.length === 0),
                                                disabledMessage: 'No modes defined',
                                                onChange: (index:number) => {
                                                    model.selectedModeIndex.set(index);
                                                    model.selectedMode.set(model.allModes.get()[index]);
                                                }
                                            }),
                                            horizontal([
                                                label({
                                                    height: 25,
                                                    width: 155,
                                                    alignment: 'left',
                                                    text: 'Choose two-tone base colour:',
                                                    visibility: compute(model.selectedMode, mode => {
                                                        debug(`mode: ${JSON.stringify(mode?.name)}`)
                                                        if (mode?.name==='Two-tone') return "visible";
                                                        return "none"
                                                        }
                                                    ),
                                                }),
                                                colourPicker({
                                                    colour: 0,
                                                    visibility: compute(model.selectedMode, mode => {
                                                        debug(`mode: ${JSON.stringify(mode?.name)}`)
                                                        if (mode?.name==='Two-tone') return "visible";
                                                        return "none"
                                                        }
                                                    ),
                                                    onChange: (colourChosen:Colour) =>
                                                        model.selectedTwoToneBase.set(colourChosen)
                                                })
                                            ]),
                                            label({
                                                height: 25,
                                                padding: {top: 5},
                                                alignment: 'centred',
                                                text: compute(model.selectedMode, mode => {
                                                    if (mode) return `${mode.description}`;
                                                    return 'No mode selected';
                                                })
                                            })
                                        ]
                                    })
                            }),
                            // group selection
                            box({
                                text: 'Group by',
                                content:
                                    vertical({
                                        padding: 5,
                                        spacing: 10,
                                        content: [
                                            dropdown({
                                                padding: {top: 5},
                                                items: compute(model.allGroupings, (groupings) => groupings.map((grouping)=>grouping.name)),
                                                selectedIndex: model.selectedGroupingIndex,
                                                disabled: compute(model.allGroupings, m => m.length === 0),
                                                disabledMessage: 'No groupings defined',
                                                onChange: (index:number) => {
                                                    model.selectedGroupingIndex.set(index);
                                                    model.selectedGrouping.set(model.allGroupings.get()[index]);
                                                }
                                            }),
                                            label({
                                                height: 75,
                                                padding: {top: 10},
                                                alignment: 'centred',
                                                text: compute(model.selectedGrouping, grouping => {
                                                    if (grouping) return `${grouping.description}`;
                                                    return 'No mode selected';
                                                })
                                            })
                                        ]
                                    })
                            }),
                            button({
                                text: 'Set ride colours according to mode',
                                disabled: compute(model.selectedRides , (rides) => rides.length<=0),
                                // todo make view update colours onClick
                                onClick: () => colourRides(),
                            }),
                    ]}),

                    // Ride Selection Section
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
                                                        if (model.selectedRides.get().length === model.allRides.get().length) {
                                                            model.selectedRides.set([]);
                                                        }
                                                        else {
                                                            model.selectedRides.set(model.allRides.get());
                                                        }
                                                    },
                                                    text: 'Select/Deselect all rides'
                                                }),
                                                label({
                                                    padding: {top: 5},
                                                    text: model.selectedRidesText,
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
                                            items: compute(model.allRideTypes, rideType => rideType.map(type =>
                                                    // Display the ride type and the number of those rides
                                                     `${RideType[type]} - ${model.allRides.get().filter(ride=>ride.type===type).length}`
                                                )),
                                            onChange: (typeIndex) => {
                                                const ridesOfThisType = model.allRides.get().filter(ride=>ride.type===model.allRideTypes.get()[typeIndex])
                                                model.selectedRides.set(ridesOfThisType)
                                            }
                                        }),
                                    ]
                                })


                        })
                    ])

                 ],
            })
        ]
    });

function onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }

