import { box, horizontal, dropdown, compute, toggle } from "openrct2-flexui";
import { model } from "../window";
import ColourChange from "../themeSettings/ColourChange";

const stationStyleElements = () =>
{
    const layout =
    box({
        text: "Station styles",
        content:
            horizontal({
                height: 10,
                content: [
                    dropdown({
                        items: compute(model.stations.all,(stations) => stations.map((station) => station.name)),
                        selectedIndex: model.stations.selectedIndex,
                        disabled: compute(model.stations.all, (s) => s.length === 0),
                        disabledMessage: 'No station styles defined.',
                        onChange: (index: number) =>
                        {
                            model.stations.selectedIndex.set(index);
                            model.stations.selected.set(model.stations.all.get()[index]);
                        }
                    }),
                    toggle({
                        isPressed:compute(model.stations.automaticallyApply,(enabled)=>enabled),
                        onChange: (isPressed) =>
                        {
                            model.stations.automaticallyApply.set(isPressed)
                            if (isPressed) ColourChange.changeRideStationStyle(model.rides.all.get())
                        }
                    })
                ]
            })
    })

    return layout
}

export default stationStyleElements
