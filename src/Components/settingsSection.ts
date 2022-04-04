import { horizontal, box, vertical, label, dropdownSpinner, toggle, compute } from "openrct2-flexui"
import model from "../model";

const settingsSectionElements = () =>
{
    const layout =
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
                                        selectedIndex: model.settings.automaticPaintFrequency,
                                        items: ["never", "daily", "weekly", "monthly", "yearly"],
                                        onChange: (index: number) => model.settings.automaticPaintFrequency.set(index),
                                    })
                                ]
                            }),
                            toggle({
                                height: 20,
                                isPressed: model.settings.repaintExistingRides,
                                text: "{BLACK}Allow repainting of already painted rides",
                                onChange: (isPressed:boolean) => model.settings.repaintExistingRides.set(isPressed),

                            }),
                            toggle({
                                height: 20,
                                text: "{BLACK}Paint newly built rides automatically",
                                isPressed: model.settings.paintBrantNewRides,
                                onChange: (isPressed:boolean) => model.settings.paintBrantNewRides.set(isPressed),
                            }),
                        ]
                }),
            }),
        ]
    })

    return layout
}

export default settingsSectionElements
