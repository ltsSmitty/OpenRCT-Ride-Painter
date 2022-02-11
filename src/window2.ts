/* eslint-disable arrow-body-style */
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
    // Grouping Data
    allGroupings: store<Grouping<number | string>[]>([]),
    selectedGroupingIndex: store<number>(0),
    selectedGrouping: store<Grouping<number | string> | null> (null),
    selectedGroupedRides: store<Ride[][]>([[]]),

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

// const subscribeRideViewerActive = (rideNumber:number ) => compute(model.filteredRides, model.pickerPageCurrentPage, (filteredRides, currentPage) => {
//     // Ride number starts between 1-10, actualRideNumber computes what the total number is.
//     const actualRideNumber = rideNumber+currentPage*10
//     if (actualRideNumber<=filteredRides.length) return "visible"
//     return "none"
// })

// const subscribeGetRideColourPart = (rideNumberInView: number, partNumber: number ) =>
//     compute(model.filteredRides, model.pickerPageCurrentPage, (filteredRides, currentPage) => {
//         // if currentPage =0, then we want filteredRides[0-9], if it's 1, then we want filteredRides[10-19]
//         const thisRideIndex = currentPage*10+(rideNumberInView-1)
//         const thisRide = filteredRides[thisRideIndex]
//         if (thisRide) {
//             debug(`ride ${rideNumberInView} colours: ${thisRide.colourSchemes[0].main}, ${thisRide.colourSchemes[0].additional}, ${thisRide.colourSchemes[0].supports}, ${thisRide.vehicleColours[0].body}, ${thisRide.vehicleColours[0].trim}, ${thisRide.vehicleColours[0].ternary}`)
//             switch(partNumber){
//                 case 0: return thisRide.colourSchemes[0].main;
//                 case 1: return thisRide.colourSchemes[0].additional;
//                 case 2: return thisRide.colourSchemes[0].supports;
//                 case 3: return thisRide.vehicleColours[0].body;
//                 case 4: return thisRide.vehicleColours[0].trim;
//                 case 5: return thisRide.vehicleColours[0].ternary;
//                 default: { debug(`in default`);return 9}
//             }
//         }
//         return 31
//     })

// const setRideColourPart = (rideNumberInView: number, partNumber: number, colour: Colour ) =>{
//     const filteredRides = model.filteredRides.get();
//     const currentPage = model.pickerPageCurrentPage.get();
//     // if currentPage =0, then we want filteredRides[0-9], if it's 1, then we want filteredRides[10-19]
//     const thisRideIndex = currentPage*10+(rideNumberInView-1)
//     const thisRide = filteredRides[thisRideIndex]
//     if (thisRide) {
//         switch(partNumber){
//             case 0: ColourChange.setRideColour(thisRide, colour, -1, -1, -1, -1, -1); break;
//             case 1: ColourChange.setRideColour(thisRide, -1, colour, -1, -1, -1, -1); break;
//             case 2: ColourChange.setRideColour(thisRide, -1, -1, colour, -1, -1, -1); break;
//             case 3: ColourChange.setRideColour(thisRide, -1, -1, -1, colour, -1, -1); break;
//             case 4: ColourChange.setRideColour(thisRide, -1, -1, -1, -1, colour, -1); break;
//             case 5: ColourChange.setRideColour(thisRide, -1, -1, -1, -1, -1, colour); break;
//             default: break;
//         }
//     }

// }

// const getRideInView = (rideNumberInView: number):Ride => {
//     const filteredRides = model.filteredRides.get();
//     const currentPage = model.pickerPageCurrentPage.get();
//     // currentPage is zero-indexed, rideNumberInView is 1-index
//     const thisRideIndex = currentPage*10+(rideNumberInView-1)
//     const thisRide = filteredRides[thisRideIndex]
//     return thisRide
// }

// const setRideLabelText = (rideInView: number) =>
//     compute(model.filteredRides, model.pickerPageCurrentPage, () => {
//         // return `"ride name": track = [0, 0, 0], cars: [0, 0, 0]`
//         const thisRide = getRideInView(rideInView);
//         if (!thisRide) return "no ride";
//         const cols = [thisRide.colourSchemes[0].main,thisRide.colourSchemes[0].additional, thisRide.colourSchemes[0].supports, thisRide.vehicleColours[0].body, thisRide.vehicleColours[0].trim, thisRide.vehicleColours[0].ternary]
//         const r = `${thisRide.name} - [${cols[0]}, ${cols[1]}, ${cols[2]}], [${cols[3]}, ${cols[4]}, ${cols[5]}]`;
//         debug(r)
//         return r
// })

// const setRideSelected = (rideNumberInView: number, isPressed: boolean) => {
//     // Get the Ride corresponding to the number in the view
//     const thisRide = getRideInView(rideNumberInView)
//     const selectedRides = model.selectedRides.get();

//     // If the ride is in the array, remove it; otherwise add it.
//     const thisRideSelectedRidesIndex = selectedRides.indexOf(thisRide)
//     debug(`selectedRides before: ${selectedRides.map(ride=> ride.name)}`)

//     if (thisRideSelectedRidesIndex === -1) selectedRides.push(thisRide)
//     else selectedRides.slice(thisRideSelectedRidesIndex, 1)
//     model.selectedRides.set(selectedRides)

//     debug(`selectedRides after: ${selectedRides.map(ride=> ride.name)}`)
// }

// const subscribeRideSelected = (rideNumberInView: number) =>
//     compute(model.selectedRides, model.filteredRides, (selectedRides) => {
//         const thisRide = getRideInView(rideNumberInView);

//         const thisRideSelectedRidesIndex = selectedRides.indexOf(thisRide)
//         debug(`thisRideSelectedRidesIndex: ${thisRideSelectedRidesIndex}`)
//         if (thisRideSelectedRidesIndex === -1) {return false}
//         return true
//         // need to set model.selectedRides to add or remove it
//     })

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
        // todo make it show a different number
        model.pickerPageText.set(`Showing ${ridesOnThisPageText} of ${filteredRides.length} rides. Page ${currentPage}/${totalPages}`)
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
                                            items: compute(model.allRideTypes, rideType => {
                                                return rideType.map(type => {
                                                // Display the ride type and the number of those rides
                                                    return `${RideType[type]} - ${model.allRides.get().filter(ride=>ride.type===type).length}`
                                                })
                                            }),
                                            onChange: (typeIndex) => {
                                                const ridesOfThisType = model.allRides.get().filter(ride=>ride.type===model.allRideTypes.get()[typeIndex])
                                                model.selectedRides.set(ridesOfThisType)
                                            }
                                        }),
                                        // fourth row of view
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
                                                    disabled: compute(model.filteredRides, model.pickerPageCurrentPage, (rides,currentPage) => {
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
                                                        // Select/Deselect all
                                                        horizontal({
                                                            // padding: 5,
                                                            content: [
                                                                button({
                                                                    text:`select/deselect all`,
                                                                    onClick: () => {}
                                                                })
                                                            ]
                                                        }),
                                                        // // rides 3 & 4
                                                        // horizontal({
                                                        //     // padding: 5,
                                                        //     content: [
                                                        //         // ride 3
                                                        //         horizontal({
                                                        //             content: [
                                                        //                 toggle({
                                                        //                     height: 12,
                                                        //                     width: 12,
                                                        //                     padding: 5,
                                                        //                     visibility: subscribeRideViewerActive(3)
                                                        //                 }),
                                                        //                 label({
                                                        //                     padding: {top:5, left: 2},
                                                        //                     text: compute(model.filteredRides, rides => {
                                                        //                         if (rides[2]) return rides[2].name
                                                        //                         return ""
                                                        //                     }),
                                                        //                     visibility: subscribeRideViewerActive(3)
                                                        //                 }),
                                                        //             ]
                                                        //         }),
                                                        //          // ride 4
                                                        //          horizontal({
                                                        //             content: [
                                                        //                 toggle({
                                                        //                     height: 12,
                                                        //                     width: 12,
                                                        //                     padding: 5,
                                                        //                     visibility: subscribeRideViewerActive(4)
                                                        //                 }),
                                                        //                 label({
                                                        //                     padding: {top:5, left: 2},
                                                        //                     text: compute(model.filteredRides, rides => {
                                                        //                         if (rides[3]) return rides[3].name
                                                        //                         return ""
                                                        //                     }),
                                                        //                     visibility: subscribeRideViewerActive(4)
                                                        //                 }),
                                                        //             ]
                                                        //         }),
                                                        //     ]}),
                                                        // // rides 5 & 6
                                                        // horizontal({
                                                        //     // padding: 5,
                                                        //     content: [
                                                        //         // ride 5
                                                        //         horizontal({
                                                        //             content: [
                                                        //                 toggle({
                                                        //                     height: 12,
                                                        //                     width: 12,
                                                        //                     padding: 5,
                                                        //                     visibility: subscribeRideViewerActive(5)
                                                        //                 }),
                                                        //                 label({
                                                        //                     padding: {top:5, left: 2},
                                                        //                     text: compute(model.filteredRides, rides => {
                                                        //                         if (rides[4]) return rides[4].name
                                                        //                         return ""
                                                        //                     }),
                                                        //                     visibility: subscribeRideViewerActive(5)
                                                        //                 }),
                                                        //             ]
                                                        //         }),
                                                        //         // ride 6
                                                        //         horizontal({
                                                        //             content: [
                                                        //                 toggle({
                                                        //                     height: 12,
                                                        //                     width: 12,
                                                        //                     padding: 5,
                                                        //                     visibility: subscribeRideViewerActive(6)
                                                        //                 }),
                                                        //                 label({
                                                        //                     padding: {top:5, left: 2},
                                                        //                     text: compute(model.filteredRides, rides => {
                                                        //                         if (rides[5]) return rides[5].name
                                                        //                         return ""
                                                        //                     }),
                                                        //                     visibility: subscribeRideViewerActive(6)
                                                        //                 }),
                                                        //             ]
                                                        //         }),
                                                        //     ]}),


                                                        // // rides 7 & 8
                                                        // horizontal({
                                                        //     // padding: 5,
                                                        //     content: [
                                                        //         // ride 7
                                                        //         horizontal({
                                                        //             content: [
                                                        //                 toggle({
                                                        //                     height: 12,
                                                        //                     width: 12,
                                                        //                     padding: 5,
                                                        //                     visibility: subscribeRideViewerActive(7)
                                                        //                 }),
                                                        //                 label({
                                                        //                     padding: {top:5, left: 2},
                                                        //                     text: compute(model.filteredRides, rides => {
                                                        //                         if (rides[6]) return rides[6].name
                                                        //                         return ""
                                                        //                     }),
                                                        //                     visibility: subscribeRideViewerActive(7)
                                                        //                 }),
                                                        //             ]
                                                        //         }),
                                                        //         // ride 8
                                                        //         horizontal({
                                                        //             content: [
                                                        //                 toggle({
                                                        //                     height: 12,
                                                        //                     width: 12,
                                                        //                     padding: 5,
                                                        //                     visibility: subscribeRideViewerActive(8)
                                                        //                 }),
                                                        //                 label({
                                                        //                     padding: {top:5, left: 2},
                                                        //                     text: compute(model.filteredRides, rides => {
                                                        //                         if (rides[7]) return rides[7].name
                                                        //                         return ""
                                                        //                     }),
                                                        //                     visibility: subscribeRideViewerActive(8)
                                                        //                 }),
                                                        //             ]
                                                        //         }),
                                                        //     ]}),
                                                        // // rides 9 & 10
                                                        // horizontal({
                                                        //     // padding: 5,
                                                        //     content: [
                                                        //         // ride 9
                                                        //         horizontal({
                                                        //             content: [
                                                        //                 toggle({
                                                        //                     height: 12,
                                                        //                     width: 12,
                                                        //                     padding: 5,
                                                        //                     visibility: subscribeRideViewerActive(9),
                                                        //                     onChange: (isPressed: boolean) => setRideSelected(9, isPressed),
                                                        //                     isPressed: subscribeRideSelected(9)
                                                        //                 }),
                                                        //                 label({
                                                        //                     padding: {top:5, left: 2},
                                                        //                     text: compute(model.filteredRides, rides => {
                                                        //                         if (rides[8]) return rides[8].name
                                                        //                         return ""
                                                        //                     }),
                                                        //                     visibility: subscribeRideViewerActive(9)
                                                        //                 }),
                                                        //             ]
                                                        //         }),
                                                        //         // ride 10
                                                        //         horizontal({
                                                        //             content: [
                                                        //                 toggle({
                                                        //                     height: 12,
                                                        //                     width: 12,
                                                        //                     padding: 5,
                                                        //                     visibility: subscribeRideViewerActive(10),
                                                        //                     onChange: (isPressed: boolean) => setRideSelected(10, isPressed),
                                                        //                     isPressed: subscribeRideSelected(10)
                                                        //                 }),
                                                        //                 label({
                                                        //                     padding: {top:5, left: 2},
                                                        //                     text: compute(model.filteredRides, rides => {
                                                        //                         if (rides[9]) return rides[9].name
                                                        //                         return ""
                                                        //                     }),
                                                        //                     visibility: subscribeRideViewerActive(10)
                                                        //                 }),
                                                        //             ]
                                                        //         }),
                                                        //     ]}),
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

