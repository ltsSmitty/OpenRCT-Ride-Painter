import RideController from "../controllers/RideController";
import { horizontal, colourPicker, compute, listview, Colour, Store,
    toggle, box, vertical, dropdown, label } from "openrct2-flexui";
import FeatureController from "../controllers/FeatureController";
import { debug } from "../helpers/logger";

const getRideColours = (ride: Ride) =>
{
    return {
        name: ride.name,
        id: ride.id,
        main: ride.colourSchemes[0].main,
        additional:ride.colourSchemes[0].additional,
        supports: ride.colourSchemes[0].supports,
        body: ride.vehicleColours[0].body,
        trim: ride.vehicleColours[0].trim,
        ternary: ride.vehicleColours[0].ternary
    }
}



const rideRowElement = (ride: Store<Ride>) =>
{
    // [ride name, colour Picker for colour 0, colour Picker for colour 1, etc.]
    const rideColours = getRideColours(ride.get())
    const element =  horizontal({
        content: [
            // 1. label
            label({
                text: rideColours.name
            }),
            // 2,3,4,5,6,7 - colour pickers
            displayRidePartColourPicker(ride,rideColours.main),
            displayRidePartColourPicker(ride,rideColours.additional),
            displayRidePartColourPicker(ride,rideColours.supports),
            displayRidePartColourPicker(ride,rideColours.body),
            displayRidePartColourPicker(ride,rideColours.trim),
            displayRidePartColourPicker(ride,rideColours.ternary),
        ]

    })
}

/**
 * @param partNumber is 0 through 5 representing track or car part
 * @returns a formatted colourPicker element
 */
const displayRidePartColourPicker = (ride: Store<Ride>, ridePartColour: number) =>
{
    const element =
    colourPicker({
        padding: {left: "40%"},
        width: "1w",
        colour: compute(ride, colours => colours[partNumber]),
        disabled: compute(mc.selectedColoursEnabled, enabledColours => !enabledColours[partNumber]),
        visibility: compute(mc.selected, mode =>
        {
            if (mode?.name==='Custom pattern') return "visible";
            return "none"
            }
        ),
        onChange: (colourChosen:Colour) =>
        {
            const currentSelectedColours = mc.selectedCustomColours.get();
            currentSelectedColours[partNumber]=colourChosen;
            mc.selectedCustomColours.set(currentSelectedColours)
        }
    })
    return element;
}

//


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


const rideColourPickers = (ride: Ride) =>
{

}


// const listElement = (fc: FeatureController) =>
// {
//     debug("hello");
//     return listview({
//         columns: [
//             {
//             header: "Selected Rides",
//             width: 150,

//             },
//             {header: "colour 1"},
//             {header: "colour 2"},
//             {header: "colour 3"},
//             {header: "colour 4"},
//             {header: "colour 5"},
//             {header: "colour 6"},
//         ],
//         items: compute(fc.rideController.selectedRides,(rides=>
//             rides?.map(ride=>getRideColours(ride))))
// })
// }
const subscribeRideViewerActive = (rideNumber = 0) => compute(model.filteredRides, model.pickerPageCurrentPage, (filteredRides) => {
    if (rideNumber<=filteredRides.length) return "visible"
    return "none"
})

 // Selected ride view
const rideRepaintSection = (rc:RideController) =>
{
    debug(`hello`);
    const thisElement = box({
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
    }
}

// export default listElement
