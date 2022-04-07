import { box, button, horizontal, dropdown, compute, toggle } from "openrct2-flexui";
import ColourChange from "../themeSettings/ColourChange";
import { StationController, RideController } from '../controllers/Controllers';

const stationStyleElements = (sc: StationController, rc: RideController) =>
{
    const layout =
    box({
        text: "Station styles",
        content:
            horizontal({
                height: 20,
                content: [
                    dropdown({
                        items: compute(sc.all,(stations) => stations.map((station) => station.name)),
                        selectedIndex: sc.selectedIndex,
                        disabled: compute(sc.all, (s) => s.length === 0),
                        disabledMessage: 'No station styles defined.',
                        onChange: (index: number) =>
                        {
                            sc.selectedIndex.set(index);
                            sc.selected.set(sc.all.get()[index]);
                            if (sc.automaticallyApply.get())
                            {
                                ColourChange.changeRideStationStyle(rc.all.get(), sc)
                            }
                        }
                    }),
                    button({
                        text: "Apply to selected",
                        onClick: () =>
                        {
                            ColourChange.changeRideStationStyle(rc.selectedRides.get()||[], sc)
                        }
                    }),
                    toggle({
                        text: "Apply automatically",
                        isPressed:compute(sc.automaticallyApply,(enabled)=>enabled),
                        onChange: (isPressed) =>
                        {
                            sc.automaticallyApply.set(isPressed)
                        }
                    })
                ]
            })
    })

    return layout
}

export default stationStyleElements
