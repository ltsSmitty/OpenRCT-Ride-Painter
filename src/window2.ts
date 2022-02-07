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
    // rides that will have the theme applied onClick()
    selectedRides: store<Ride[]>([]),
    selectedRidesText: store<string>(""),
    // rides that'll show in the view

    filteredRides: store<Ride[]>([]),
    // a subset of the visible rides that will be viewed on any given page
    // will be between 0-10
    // 0 if no rides exist, capping at 10 for any single p

    // index of dropdown to filter rides for view
    rideTypeFilterIndex: store<number>(0),
    rideTypeFilter: store<RideType | null>(null),
    pickerPageCurrentPage: store<number>(0),
    pickerPageText: store<string>(""),
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

const subscribeRideViewerActive = (rideNumber = 0) => compute(model.filteredRides, model.pickerPageCurrentPage, (filteredRides) => {
    if (rideNumber<=filteredRides.length) return "visible"
    return "none"
})

/**
 *
 * Find the right ride based on model.pickerPageCurrentPage
 * Returns the colour of the ride in the position defined by @param rideNumberInView (1-10)
 * @param partNumber
 * @returns
 */
// eslint-disable-next-line consistent-return
const subscribeGetRideColourPart = (rideNumberInView: number, partNumber: number ) =>
    compute(model.filteredRides, model.pickerPageCurrentPage, (filteredRides, currentPage) => {
        // if currentPage =0, then we want filteredRides[0-9], if it's 1, then we want filteredRides[10-19]
        const thisRideIndex = currentPage*10+(rideNumberInView-1)
        const thisRide = filteredRides[thisRideIndex]
        if (thisRide) {
            switch(partNumber){
                case 0: return thisRide.colourSchemes[0].main;
                case 1: return thisRide.colourSchemes[0].additional;
                case 2: return thisRide.colourSchemes[0].supports;
                case 3: return thisRide.vehicleColours[0].body;
                case 4: return thisRide.vehicleColours[0].trim;
                case 5: return thisRide.vehicleColours[0].ternary;
                default: { debug(`in default`);return 9}
            }
        }
        return 31
    })

    const setRideColourPart = (rideNumberInView: number, partNumber: number, colour: Colour ) =>{
        const filteredRides = model.filteredRides.get();
        const currentPage = model.pickerPageCurrentPage.get();
        // if currentPage =0, then we want filteredRides[0-9], if it's 1, then we want filteredRides[10-19]
        const thisRideIndex = currentPage*10+(rideNumberInView-1)
        const thisRide = filteredRides[thisRideIndex]
        if (thisRide) {
            switch(partNumber){
                case 0: ColourChange.setRideColour(thisRide, colour, -1, -1, -1, -1, -1); break;
                case 1: ColourChange.setRideColour(thisRide, -1, colour, -1, -1, -1, -1); break;
                case 2: ColourChange.setRideColour(thisRide, -1, -1, colour, -1, -1, -1); break;
                case 3: ColourChange.setRideColour(thisRide, -1, -1, -1, colour, -1, -1); break;
                case 4: ColourChange.setRideColour(thisRide, -1, -1, -1, -1, colour, -1); break;
                case 5: ColourChange.setRideColour(thisRide, -1, -1, -1, -1, -1, colour); break;
                default: break;
            }
        }

    }

    // const subscribeSetRideColourPart= (rideNumberInView: number, partNumber: number, colour: Colour ) =>{
    //     compute(model.filteredRides, model.pickerPageCurrentPage, (filteredRides, currentPage) => {
    //         // if currentPage =0, then we want filteredRides[0-9], if it's 1, then we want filteredRides[10-19]
    //         debug(`trying to setRideColourPart`)
    //         const thisRideIndex = currentPage*10+(rideNumberInView-1)
    //         const thisRide = filteredRides[thisRideIndex]
    //         debug(`ride before: ${JSON.stringify(thisRide.colourSchemes[0])}`)
    //         if (thisRide) {
    //             switch(partNumber){
    //                 case 0: ColourChange.setRideColour(thisRide, colour, -1, -1, -1, -1, -1); break;
    //                 case 1: ColourChange.setRideColour(thisRide, -1, colour, -1, -1, -1, -1); break;
    //                 case 2: ColourChange.setRideColour(thisRide, -1, -1, colour, -1, -1, -1); break;
    //                 case 3: ColourChange.setRideColour(thisRide, -1, -1, -1, colour, -1, -1); break;
    //                 case 4: ColourChange.setRideColour(thisRide, -1, -1, -1, -1, colour, -1); break;
    //                 case 5: ColourChange.setRideColour(thisRide, -1, -1, -1, -1, -1, colour); break;
    //                 default: break;
    //             }
    //         debug(`ride after: ${JSON.stringify(thisRide.colourSchemes[0])}`)
    //         }
    //     }
    // )}

    // // its a colourScheme
    // if (partNumber<=2 && thisRide.colourSchemes) {
    //     const keys = Object.keys(thisRide.colourSchemes[0])
    //     const colourofPartNumber = thisRide.colourSchemes[0][keys[partNumber]]
    //     debug(`colourofPartNumber: ${colourofPartNumber}`)
    //     return colourofPartNumber as Colour
    // }
    // // its a vehicleColour
    // else {
    //     const keys = Object.keys(model.filteredRides.get()[rideNumber].colourSchemes[0])
    //     debug(`keys[partNumber]: ${keys[partNumber]}`)
    //     return 0
    // }    }


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

const colourRides = () => {
	const currentTheme = model.selectedTheme.get();
	const currentMode = model.selectedMode.get();

	if (currentTheme && currentMode) {
		// get all rides
		const ridesToTheme = model.selectedRides.get();
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
        const filteredRides = model.filteredRides.get();
        const totalPages = Math.floor(filteredRides.length/10)+1;
        const currentPage = model.pickerPageCurrentPage.get() + 1
        const rideRemainder = filteredRides.length % 10;

        // set the text for number of rides selected
        model.selectedRidesText.set(`${selectedRides.length}/${model.allRides.get().length} rides selected`)

        // If the user deselects rides, reset the page back to the 0
        if (currentPage>totalPages) model.pickerPageCurrentPage.set(0);

        // show either the selected number remainder of rides or the remainder
        const ridesOnThisPageText = (currentPage !== totalPages) ? `${Math.min(filteredRides.length,10)}` : `${Math.min(rideRemainder,10)}`
        model.pickerPageText.set(`Showing ${ridesOnThisPageText}/10 rides on page ${currentPage}/${totalPages}`)

        // actually selected rides for onClick
        // all the rides that'll show up as i page through the view
        // the currently shown rides

        // set the visible rides in the view
        // paginate through the selected
        // model.ridesInView.set()
        // model.filteredRides.set()
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
                                                alignment: 'centred',
                                                text: compute(model.selectedMode, mode => {
                                                    if (mode) return `${mode.description}`;
                                                    return 'No mode selected';
                                                })
                                            })
                                        ]
                                    })
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
                                                // toggle to Select all rides
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
                                                        if (rides.length!==model.allRides.get().length) return "Select all rides"
                                                        return "Deselect all rides"
                                                    })
                                                }),
                                                label({
                                                    padding: {top: 5},
                                                    text: "filter by ride type:"
                                                }),
                                                dropdown({
                                                    width: 180,
                                                    padding: {top: 5},
                                                    items: compute(model.allRideTypes, rideType => rideType.map(type => RideType[type])),
                                                    onChange: (typeIndex) => {
                                                        const ridesOfThisType = model.allRides.get().filter(ride=>ride.type===model.allRideTypes.get()[typeIndex])
                                                        debug(`ride of types ${typeIndex}: ${ridesOfThisType.map(ride=>ride.name)}`)
                                                        model.filteredRides.set(ridesOfThisType)
                                                    }
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
                                                    text: 'Show selected rides',
                                                    onClick: () => {
                                                        model.filteredRides.set(model.selectedRides.get())
                                                    }
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
                                                                            height: 17,
                                                                            width: 17,
                                                                            padding: 5,
                                                                            visibility: subscribeRideViewerActive(1)
                                                                        }),
                                                                        label({
                                                                            padding: 4,
                                                                            text: compute(model.filteredRides, rides => {
                                                                                if (rides[0]) return rides[0].name
                                                                                return ""
                                                                            }),
                                                                            visibility: subscribeRideViewerActive(1)
                                                                        }),
                                                                        // track main colour
                                                                        colourPicker({
                                                                            visibility: subscribeRideViewerActive(1),
                                                                            colour: subscribeGetRideColourPart(1,0),
                                                                            onChange: (colour:Colour) => {setRideColourPart(1,0, colour)}
                                                                        }),
                                                                        // track additional colour
                                                                        colourPicker({
                                                                            visibility: subscribeRideViewerActive(1),
                                                                            colour: subscribeGetRideColourPart(1,1),
                                                                            onChange: (colour:Colour) => {setRideColourPart(1,1, colour)}
                                                                        }),
                                                                        // track support colour
                                                                        colourPicker({
                                                                            visibility: subscribeRideViewerActive(1),
                                                                            colour: subscribeGetRideColourPart(1,2),
                                                                            onChange: (colour:Colour) => {setRideColourPart(1,2, colour)}
                                                                        }),
                                                                        // car main colour
                                                                        colourPicker({
                                                                            visibility: subscribeRideViewerActive(1),
                                                                            colour: subscribeGetRideColourPart(1,3),
                                                                            onChange: (colour:Colour) => {setRideColourPart(1,3, colour)}
                                                                        }),
                                                                        // car additional colour
                                                                        colourPicker({
                                                                            visibility: subscribeRideViewerActive(1),
                                                                            colour: subscribeGetRideColourPart(1,4),
                                                                            onChange: (colour:Colour) => {setRideColourPart(1,4, colour)}
                                                                        }),
                                                                        // car tertiary colour
                                                                        colourPicker({
                                                                            visibility: subscribeRideViewerActive(1),
                                                                            colour: subscribeGetRideColourPart(1,5),
                                                                            onChange: (colour:Colour) => {setRideColourPart(1,5, colour)}
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
