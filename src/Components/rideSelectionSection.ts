import { vertical, box, dropdown, compute, label, horizontal, button } from "openrct2-flexui"
import { RideType } from "../helpers/RideType"
import { RideController } from "../controllers/Controllers";

const rideSelectionElements = (rc: RideController) =>
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
                            selectedIndex: compute(rc.selectedIndex, index=> index),
                            items: compute(rc.allRideTypes, rideType => rideType.map(type =>
                                    // Display the ride type and the number of those rides
                                        `${RideType[type]} - ${rc.all.get()
                                            .filter(ride=>ride.type===type).length}`
                                )),
                            onChange: (typeIndex) =>
                            {
                                const ridesOfThisType = rc.all.get()
                                    .filter(ride=>ride.type===rc.allRideTypes.get()[typeIndex])
                                rc.selectedRides.set(ridesOfThisType)
                                rc.selectedIndex.set(typeIndex)
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
                                        if (rc.selectedRides.get()?.length === rc.all.get().length)
                                        {
                                            rc.selectedRides.set([]);
                                        }
                                        else
                                        {
                                            rc.selectedRides.set(rc.all.get());
                                        }
                                    },
                                    text: '{BLACK}Select/Deselect all rides'
                                }),
                                label({
                                    padding: {top: 5},
                                    text: rc.selectedText,
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
