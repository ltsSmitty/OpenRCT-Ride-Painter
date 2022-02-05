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

    // Ride theme application selection
    // all rides
    allRides: store<Ride[]>([]),
    allRideTypes: store<RideType[]>([]),
    // rides that'll show in the view
    visibleRides: store<Ride[]>([]),
    // rides that will have the theme applied onClick()
    selectedRides: store<Ride[]>([]),
    selectedRidesText: store<string>(""),
    // index of dropdown to filter rides for view
    rideTypeFilterIndexstore: store<number>(0),
    rideTypeFilter: store<RideType | null>(null),
    pickerPageCurrentPage: store<number>(0),
    pickerPageText: store<string>(""),
    // a subset of the visible rides that will be viewed on any given page
    // will be between 0-10
    // 0 if no rides exist, capping at 10 for any single page
    // updates onUpdate() based on current page
    ridesOnCurrentPage: store<Ride[]>([])
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

const subscribeRideViewerActive = (rideNumber = 0) => compute(model.visibleRides, visibleRides => {
    if (rideNumber<=visibleRides.length) return "visible"
    return "none"
})

// eslint-disable-next-line consistent-return
const subscribeGetRideColourPart = (rideNumber = 0, partNumber = 0) => compute(model.visibleRides, visibleRides => {
    if (visibleRides[rideNumber]) {
        const parts = (partNumber<=2) ? Object.keys(visibleRides[rideNumber].colourSchemes[0])[partNumber] : Object.keys(visibleRides[rideNumber].vehicleColours[0])[partNumber]
        debug(`Parts: ${parts}`)

    }
    return 0 as Colour
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
    model.allRides.set(map.rides.filter(ride=> ride.classification === 'ride'));
    debug(model.allRides.get().length.toString())
    const allRideTypes = model.allRides.get().map(ride => ride.type);
    const uniqueRideTypes = allRideTypes
        // get the unique ride types
        .filter(onlyUnique)
        // get only non-zero/truthy values
        .filter( n => n);
    debug(
        `All ride types: ${allRideTypes}
    Unique Ride Types: ${uniqueRideTypes}`);
    model.allRideTypes.set(uniqueRideTypes);
    model.visibleRides.set(model.allRides.get())
}

const colourRides = () => {
	const currentTheme = model.selectedTheme.get();
	const currentMode = model.selectedMode.get();

	if (currentTheme && currentMode) {
		// get all rides
		const ridesToTheme = map.rides.filter((ride) => ride.classification === 'ride');
		ridesToTheme.forEach((ride, i) => {
			const cols = currentMode.applyTheme(currentTheme,
                {baseColour:model.selectedTwoToneBase.get(),
                index: i});
			if (cols) {
				ColourChange.setRideColour(ride, ...cols);
			}
		});
	}
};

// eslint-disable-next-line import/prefer-default-export
export const themeWindow = window({
	title: 'ToggleTest',
	width: 700,
    minWidth: 280,
    maxWidth: 700,
	height: 300,
	minHeight: 220,
	maxHeight: 400,
	padding: 8,
	onOpen: () => {
		modeInit();
		themeInit();
        rideTypeInit();
	},
    onUpdate: () => {

        // Page picker text output
        const selectedRides = model.selectedRides.get();
        const totalSelectedRides = selectedRides.length;
        const totalPages = Math.floor(totalSelectedRides/10)+1;
        const currentPage = model.pickerPageCurrentPage.get() + 1
        const rideRemainder = totalSelectedRides % 10;

        // set the text for number of rides selected
        model.selectedRidesText.set(`${totalSelectedRides}/${model.allRides.get().length} rides selected`)

        // If the user deselects rides, reset the page back to the 0
        if (currentPage>totalPages) model.pickerPageCurrentPage.set(0);

        // show either the selected number remainder of rides or the remainder

        const ridesOnThisPageText = (currentPage !== totalPages) ? `${Math.min(totalSelectedRides,10)}` : `${Math.min(rideRemainder,10)}`
        model.pickerPageText.set(`Showing ${ridesOnThisPageText}/10 rides on page ${currentPage}/${totalPages}`)

        // actually selected rides for onClick
        // all the rides that'll show up as i page through the view
        // the currently shown rides

        // set the visible rides in the view
        // paginate through the selected
        debug(`Visible rides: ${model.visibleRides.get().forEach(r=>r.name)}`)
        // model.ridesOnCurrentPage.set()
        // model.visibleRides.set()
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
                                                    height: 20,
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
                                                alignment: 'centred',
                                                text: compute(model.selectedMode, mode => {
                                                    if (mode) return `${mode.description}`;
                                                    return 'No mode selected';
                                                })
                                            })
                                        ]
                                    })
                            }),
                            toggle({
                                text: ' Select rides to apply theme ==>',
                                onChange: () => {
                                    const rides = map.rides.filter(ride => ride.classification === "ride");
                                    rides.forEach(ride => {
                                        debug(`ride name: ${ride.name}, ride type: ${ride.type}`)
                                    })
                                }
                            }),
                            button({
                                text: 'Set ride colours according to mode',
                                disabled: compute(model.selectedMode , (mode) => !mode),
                                onClick: () => colourRides(),
                            }),
                    ]}),

                    // Ride Selection Section
                    vertical([
                        box({
                            text: 'Ride Selection',
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
                                                toggle({
                                                    width:25,
                                                    onChange: (isPressed) => {
                                                        if (isPressed) {
                                                            model.selectedRides.set(model.allRides.get());
                                                        }
                                                        else {
                                                            model.selectedRides.set([]);
                                                        }
                                                    }
                                                }),
                                                label({
                                                    padding: {top: 5},
                                                    text: compute(model.selectedRides, rides => {
                                                        // TODO make the starting value show as `select all rides`
                                                        // debug(`selected rides: ${rides.length} all rides: ${model.allRides.get().length}`)
                                                        if (rides.length===model.allRides.get().length) return "Deselect all rides"
                                                        return "Select all rides"
                                                    })
                                                }),
                                                label({
                                                    padding: {top: 5},
                                                    text: "filter by ride type:"
                                                }),
                                                dropdown({
                                                    padding: {top: 5},
                                                    items: compute(model.allRideTypes, rideType => rideType.map(type => type.toString()))
                                                })
                                            ]

                                        }),
                                        // Second row of view
                                        horizontal({
                                            height: 25,
                                            padding: 10,
                                            spacing: 5,
                                            content: [
                                                button({
                                                    text: 'Show selected rides'
                                                }),
                                                label({
                                                    text: model.selectedRidesText
                                                }),
                                                button({
                                                    text: 'Clear filter'
                                                })

                                            ]
                                        }),
                                        // Third row of view
                                        horizontal({
                                            padding: 5,
                                            height: 30,
                                            content: [
                                                button({
                                                    width: 25,
                                                    text: "<--",
                                                    disabled: compute(model.pickerPageCurrentPage,page => page===0),
                                                    onClick: () => model.pickerPageCurrentPage.set(model.pickerPageCurrentPage.get()-1)

                                                }),
                                                label({
                                                    padding: {top: 10},
                                                    alignment: 'centred',
                                                    text: model.pickerPageText
                                                }),
                                                button({
                                                    width: 25,
                                                    text: "-->",
                                                    disabled: compute(model.selectedRides, model.pickerPageCurrentPage, (rides,currentPage) => {
                                                        // returns true if there are more pages left
                                                        const totalPages = Math.floor(rides.length/10)+1;
                                                        const onLastPage = (currentPage + 1 === totalPages)
                                                        return onLastPage
                                                    }),
                                                    onClick: () => model.pickerPageCurrentPage.set(model.pickerPageCurrentPage.get()+1)

                                                })
                                            ]
                                        }),
                                        // Selected ride view
                                        box({
                                            padding: 5,
                                            content:
                                                vertical({
                                                    padding: 0,
                                                    content: [
                                                        // rides 1 & 2
                                                        horizontal({
                                                            // padding: 5,
                                                            content: [
                                                                // ride 1
                                                                horizontal({
                                                                    content: [
                                                                        toggle({
                                                                            visibility: subscribeRideViewerActive(1)
                                                                        }),
                                                                        label({
                                                                            text: compute(model.visibleRides, rides => {
                                                                                if (rides[0]) return rides[0].name
                                                                                return ""
                                                                            }),
                                                                            visibility: subscribeRideViewerActive(1)
                                                                        }),
                                                                        // track main colour
                                                                        colourPicker({
                                                                            visibility: subscribeRideViewerActive(1),
                                                                            colour: subscribeGetRideColourPart(1,0),
                                                                            onChange: () => {subscribeGetRideColourPart(1,0)}
                                                                        }),
                                                                        // track additional colour
                                                                        colourPicker({
                                                                            visibility: subscribeRideViewerActive(1)
                                                                        }),
                                                                        // track support colour
                                                                        colourPicker({
                                                                            visibility: subscribeRideViewerActive(1)
                                                                        }),
                                                                        // car main colour
                                                                        colourPicker({
                                                                            visibility: subscribeRideViewerActive(1)
                                                                        }),
                                                                        // car additional colour
                                                                        colourPicker({
                                                                            visibility: subscribeRideViewerActive(1)
                                                                        }),
                                                                        // car tertiary colour
                                                                        colourPicker({
                                                                            visibility: subscribeRideViewerActive(1)
                                                                        }),
                                                                    ]
                                                                }),
                                                                label({
                                                                    text: "ride 2"
                                                                })
                                                            ]
                                                        }),
                                                        // rides 3 & 4
                                                        horizontal({
                                                            // padding: 5,
                                                            content: [
                                                                label({
                                                                    text: "ride 3"
                                                                }),
                                                                label({
                                                                    text: "ride 4"
                                                                })
                                                            ]}),
                                                        // rides 5 & 6
                                                        horizontal({
                                                            // padding: 5,
                                                            content: [
                                                                label({
                                                                    text: "ride 5"
                                                                }),
                                                                label({
                                                                    text: "ride 6"
                                                                })
                                                            ]}),
                                                        // rides 7 & 8
                                                        horizontal({
                                                            // padding: 5,
                                                            content: [
                                                                label({
                                                                    text: "ride 7"
                                                                }),
                                                                label({
                                                                    text: "ride 8"
                                                                })
                                                            ]}),
                                                        // rides 9 & 10
                                                        horizontal({
                                                            // padding: 5,
                                                            content: [
                                                                label({
                                                                    text: "ride 9"
                                                                }),
                                                                label({
                                                                    text: "ride 10"
                                                                })
                                                            ]}),
                                                    ]
                                                })

                                        })
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
