/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import { window, vertical, box, horizontal, toggle, label,
    compute, dropdown, button, colourPicker, Colour } from "openrct2-flexui"
import { FeatureController } from "./controllers/Controllers"
import { debug } from "./helpers/logger"
import { RideType } from "./helpers/RideType"
import { WindowWatcher } from "./window"


export const themeWindow = (
    featureController: FeatureController) =>
{
    const {rideController, themeController, groupingController,
        modeController, stationController, settingsController} = featureController

    return window({
        title: 'Ride Painter',
        width: 400, maxWidth: 700, minWidth: 0,
        height: 600, maxHeight: 600, minHeight: 600,
        spacing: 10,
        padding: 8,
        colours: [20,7],
        onOpen: () =>
        {
            if (WindowWatcher.onWindowOpen)
            {
                WindowWatcher.onWindowOpen()
            }
        },
        onUpdate: () =>
        {
            if (WindowWatcher.onWindowUpdate)
            {
                WindowWatcher.onWindowUpdate()
            }
        },
        onClose: () =>
        {
            if (WindowWatcher.onWindowClose)
            {
                WindowWatcher.onWindowClose()
            }
        },
        content: [

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
                                onChange: (isPressed) =>
{
                                    if (isPressed)
{
                                        rideController.selectedRides.set(rideController.all.get());
                                    }
                                    else
{
                                        rideController.selectedRides.set([]);
                                    }
                                }
                            }),
                            label({
                                padding: {top: 5},
                                text: compute(rideController.selectedRides, rides =>
{
                                    // TODO make the starting value show as `select all rides`
                        // debug(`selected rides: ${rides.length} all rides: ${model.allRides.get().length}`)
                                    if (rides.length!==rideController.all.get().length) return "Select all rides"
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
                                items: compute(rideController.allRideTypes, rideType => rideType.map(type => RideType[type])),
                                onChange: (typeIndex) =>
{
                                const ridesOfThisType = rideController.all.get().filter(ride=>ride.type===rideController.allRideTypes.get()[typeIndex])
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
                                onClick: () =>
{
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
                                disabled: compute(model.selectedRides, model.pickerPageCurrentPage, (rides,currentPage) =>
{
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
                                                        text: compute(model.filteredRides, rides =>
{
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
])]})
}
