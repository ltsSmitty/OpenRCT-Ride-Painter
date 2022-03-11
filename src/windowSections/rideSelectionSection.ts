import { vertical, box, dropdown, compute, label, horizontal, button } from "openrct2-flexui"
import { RideType } from "../RideType"
import { model } from "../window"

const rideSelectionElements = () =>
{
    const layout =
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
                                        `${RideType[type]} - ${model.rides.all.get()
                                            .filter(ride=>ride.type===type).length}`
                                )),
                            onChange: (typeIndex) =>
                            {
                                const ridesOfThisType = model.rides.all.get()
                                    .filter(ride=>ride.type===model.rides.allRideTypes.get()[typeIndex])
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
                                    onClick: () =>
                                    {
                                        if (model.rides.selected.get().length === model.rides.all.get().length)
                                    {
                                            model.rides.selected.set([]);
                                        }
                                        else
                                    {
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
    ])

    return layout
}

export default rideSelectionElements
