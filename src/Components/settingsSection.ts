import { horizontal, box, vertical, label, dropdownSpinner, toggle, compute, checkbox } from "openrct2-flexui"
import { SettingsController } from '../controllers/Controllers';

const settingsSectionElements = (sc: SettingsController) =>
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
                                        selectedIndex: sc.automaticPaintFrequency,
                                        items: ["never", "daily", "weekly", "monthly", "yearly"],
                                        onChange: (index: number) => sc.automaticPaintFrequency.set(index),
                                    })
                                ]
                            }),
                            checkbox({
                                height: 20,
                                isChecked: sc.repaintExistingRides,
                                text: "{BLACK}Allow repainting of already painted rides",
                                onChange: (isPressed:boolean) => sc.repaintExistingRides.set(isPressed),

                            }),
                            checkbox({
                                height: 20,
                                text: "{BLACK}Paint newly built rides automatically",
                                isChecked: sc.paintBrantNewRides,
                                onChange: (isPressed:boolean) => sc.paintBrantNewRides.set(isPressed),
                            }),
                        ]
                }),
            }),
        ]
    })

    return layout
}

export default settingsSectionElements
