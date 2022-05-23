import { horizontal, colourPicker, compute, Colour, toggle, box, vertical, dropdown, label } from "openrct2-flexui";
import { ModeController } from "../controllers/BaseController";
import { debug } from "../helpers/logger";

// Mode selection is quite straightforward except for Custom Pattern mode
// Much of this code is specifically for helping Custom Pattern mode

/**
 * Helper for 'Custom Pattern' mode.
 * Combine the selected colours & widget active state to know what to paint and return a Colour[]
 */
const combineCustomColourArrays = (mc: ModeController): Colour[] =>
{
    const colours = mc.selectedCustomColours.get();
    const enabledArr = mc.selectedColoursEnabled.get();
    const ret = [];
    for (let i=0; i<colours.length;i+=1)
    {
        ret[i] = (enabledArr[i] ? colours[i] : -1)
    }
    return ret;
}

const modeSectionElements = (mc: ModeController) =>
{
    /**
     * Helper for 'Custom Pattern' mode. Flip the active state of the colourPicker widgets onClick/onChange
     */
    const enableRideColourPicker = (index:number) =>
    {
        const enabledColours = mc.selectedColoursEnabled.get()
        enabledColours[index] = !enabledColours[index]
        mc.selectedColoursEnabled.set(enabledColours);
    }

    /**
     * @param partNumber is 0 through 5 representing track or car part
     * @returns a formatted colourPicker element
     */
    const customPatternColourPickerElement = (partNumber: number) =>
    {
        const element =
        colourPicker({
            padding: {left: "40%"},
            width: "1w",
            colour: compute(mc.selectedCustomColours, colours => colours[partNumber]),
            disabled: compute(mc.selectedColoursEnabled, enabledColours => !enabledColours[partNumber]),
            visibility: compute(mc.selected, mode =>
            {
                if (mode?.name==='Custom pattern') return "visible";
                return "hidden"
            }),
            onChange: (colourChosen:Colour) =>
            {
                const currentSelectedColours = mc.selectedCustomColours.get();
                currentSelectedColours[partNumber]=colourChosen;
                mc.selectedCustomColours.set(currentSelectedColours)
            }
        })
        return element;
    }

    const customPatternColourPickerElements = () => horizontal([
        // track main
        customPatternColourPickerElement(0),
        // track additional
        customPatternColourPickerElement(1),
        // track supports
        customPatternColourPickerElement(2),
        // car main
        customPatternColourPickerElement(3),
        // car trim
        customPatternColourPickerElement(4),
        // car tertiary
        customPatternColourPickerElement(5),
    ]);

    const customPatternToggleElements = () =>
    // TOGGLES TO ENABLE/DISABLE COLOUR PICKERS
    horizontal({
        height: 20,
        content: [
            toggle({
                text: "{BLACK}Track main",
                isPressed: compute(mc.selectedColoursEnabled, enabledColours => enabledColours[0]),
                onChange: () => enableRideColourPicker(0),
                visibility: compute(mc.selected, mode =>
                {
                    if (mode?.name==='Custom pattern') return "visible";
                    return "hidden"
                    }
                ),
            }),
            toggle({
                text: "{BLACK}Track add'l",
                isPressed: compute(mc.selectedColoursEnabled, enabledColours => enabledColours[1]),
                onChange: () => enableRideColourPicker(1),
                visibility: compute(mc.selected, mode =>
                {
                    if (mode?.name==='Custom pattern') return "visible";
                    return "hidden"
                    }
                ),
            }),
            toggle({
                text: "{BLACK}Track sups",
                isPressed: compute(mc.selectedColoursEnabled, enabledColours => enabledColours[2]),
                onChange: () => enableRideColourPicker(2),
                visibility: compute(mc.selected, mode =>
                {
                    if (mode?.name==='Custom pattern') return "visible";
                    return "hidden"
                    }
                ),
            }),
            toggle({
                text: "{BLACK}Car main",
                isPressed: compute(mc.selectedColoursEnabled, enabledColours => enabledColours[3]),
                onChange: () => enableRideColourPicker(3),
                visibility: compute(mc.selected, mode =>
    {
                    if (mode?.name==='Custom pattern') return "visible";
                    return "hidden"
                    }
                ),
            }),
            toggle({
                text: "{BLACK}Car trim",
                isPressed: compute(mc.selectedColoursEnabled, enabledColours => enabledColours[4]),
                onChange: () => enableRideColourPicker(4),
                visibility: compute(mc.selected, mode =>
                {
                    if (mode?.name==='Custom pattern') return "visible";
                    return "hidden"
                    }
                ),
            }),
            toggle({
                text: "{BLACK}Car add'l",
                isPressed: compute(mc.selectedColoursEnabled, enabledColours => enabledColours[5]),
                onChange: () => enableRideColourPicker(5),
                visibility: compute(mc.selected, mode =>
                {
                    if (mode?.name==='Custom pattern') return "visible";
                    return "hidden"
                    }
                ),
            }),
        ]
    })

    const layout =
    box({
        text: '2. Pick a painting mode',
        // height: 100,
        // padding:{bottom:5},
        content:
            vertical({
                padding: 5,
                spacing: 10,
                content: [
                    dropdown({
                        padding: {top:5},
                        items: compute(mc.all, (m) => m.map((mode)=>mode.name)),
                        selectedIndex: mc.selectedIndex,
                        disabled: compute(mc.all, m => m.length === 0),
                        disabledMessage: 'No modes defined',
                        onChange: (index:number) =>
                        {
                            mc.selectedIndex.set(index);
                            mc.selected.set(mc.all.get()[index]);
                        }
                    }),
                    label({
                        // height: 25,
                        padding: {top: 5},
                        alignment: 'centred',
                        text: compute(mc.selected, mode =>
                    {
                            if (mode) return `${mode.description}`;
                            return 'No mode selected';
                        })
                    }),
                    customPatternColourPickerElements(),
                    customPatternToggleElements()
                ]
            })
    })
    return layout
}

export { modeSectionElements, combineCustomColourArrays }
