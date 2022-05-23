import { box, vertical, dropdown, compute, horizontal, colourPicker, Colour } from "openrct2-flexui";
import {ThemeController} from "../controllers/BaseController";

const themeSectionElements = (themeController:ThemeController) =>
{
    /**
     * Helper for the theme section colourPickers to compute what colour to display
     * todo try using subscribe instead of compute to simplify
     */
    const subscribeColourPicker = (colourToggleIndex: Colour) => compute(themeController.selected, theme =>
    {
        if (theme?.colours.themeColours[colourToggleIndex])
    {
            return theme.colours.themeColours[colourToggleIndex] as Colour
    }
        return 0 as Colour
    })

    /**
    * Helper for theme section colourPickers to compute whether to display or be invisible
    */
    const subscribeColourPickerActive = (colourToggleIndex: Colour) => compute(themeController.selected, theme =>
    {
    if (theme?.colours.themeColours.length &&  theme.colours.themeColours.length > colourToggleIndex) return "visible"
        return "none"
    })

    const layout = horizontal({
        height: 85,
        content:[
            vertical({
                width: '200px',
                content: [
                    box({
                        text: '1. Pick a theme',
                        content:
                            vertical({
                                spacing: 0,
                                content: [
                                    dropdown({
                                        items: compute(themeController.all, (t) => t.map((theme) => theme.name)),
                                        selectedIndex: themeController.selectedIndex,
                                        disabled: compute(themeController.all, (t) => t.length === 0),
                                        disabledMessage: 'No themes defined.',
                                        onChange: (index: number) =>
                                        {
                                            themeController.selectedIndex.set(index);
                                            themeController.selected.set(themeController.all.get()[index]);
                                        }
                                    }),
                                    // first row of theme colours
                                    horizontal({
                                        spacing: 0,
                                        content:[
                                        colourPicker({
                                            colour: subscribeColourPicker(0),
                                            visibility: subscribeColourPickerActive(0, ),
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(1, ),
                                            visibility: subscribeColourPickerActive(1, ),
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(2, ),
                                            visibility: subscribeColourPickerActive(2, ),
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(3, ),
                                            visibility: subscribeColourPickerActive(3, ),
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(4, ),
                                            visibility: subscribeColourPickerActive(4, ),
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(5, ),
                                            visibility: subscribeColourPickerActive(5, ),
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(6, ),
                                            visibility: subscribeColourPickerActive(6, ),
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(7, ),
                                            visibility: subscribeColourPickerActive(7, ),
                                        }),
                                    ]}),
                                    // second row of theme colours
                                    horizontal({
                                        spacing: 0,
                                        content:[
                                        // a bunch of colour pickers to show the theme colours
                                        // 0th colour picker
                                        colourPicker({
                                            colour: subscribeColourPicker(8, ),
                                            visibility: subscribeColourPickerActive(8, ),
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(9, ),
                                            visibility: subscribeColourPickerActive(9, ),
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(10, ),
                                            visibility: subscribeColourPickerActive(10, ),
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(11, ),
                                            visibility: subscribeColourPickerActive(11, ),
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(12, ),
                                            visibility: subscribeColourPickerActive(12, ),
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(13, ),
                                            visibility: subscribeColourPickerActive(13, ),
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(14, ),
                                            visibility: subscribeColourPickerActive(14, ),
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(15, ),
                                            visibility: subscribeColourPickerActive(15, ),
                                        }),
                                    ]}),

                                    // third row
                                    horizontal({
                                        spacing: 0,
                                        content: [
                                        colourPicker({
                                            colour: subscribeColourPicker(16, ),
                                            visibility: subscribeColourPickerActive(16, )
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(17, ),
                                            visibility: subscribeColourPickerActive(17, )
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(18, ),
                                            visibility: subscribeColourPickerActive(18, )
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(19, ),
                                            visibility: subscribeColourPickerActive(19, )
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(20, ),
                                            visibility: subscribeColourPickerActive(20, )
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(21, ),
                                            visibility: subscribeColourPickerActive(21, )
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(22, ),
                                            visibility: subscribeColourPickerActive(22, )
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(23, ),
                                            visibility: subscribeColourPickerActive(23, )
                                        }),
                                    ]}),
                                    // fourth row
                                    horizontal({
                                        spacing: 0,
                                        content: [
                                        colourPicker({
                                            colour: subscribeColourPicker(24, ),
                                            visibility: subscribeColourPickerActive(24, )
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(25, ),
                                            visibility: subscribeColourPickerActive(25, )
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(26, ),
                                            visibility: subscribeColourPickerActive(26, )
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(27, ),
                                            visibility: subscribeColourPickerActive(27, )
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(28, ),
                                            visibility: subscribeColourPickerActive(28, )
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(29, ),
                                            visibility: subscribeColourPickerActive(29, )
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(30, ),
                                            visibility: subscribeColourPickerActive(30, )
                                        }),
                                        colourPicker({
                                            colour: subscribeColourPicker(31, ),
                                            visibility: subscribeColourPickerActive(31, )
                                        }),
                                    ]})
                                ]
                            })
                        })
                    ]

                }),
        ]
    });

    return layout
}

    export default themeSectionElements
