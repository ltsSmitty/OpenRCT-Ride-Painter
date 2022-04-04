import { box, horizontal, dropdown, compute, toggle } from "openrct2-flexui";
import ColourChange from "../themeSettings/ColourChange";
import { StationController, RideController } from '../controllers/Controllers';

const stationStyleElements = (sc: StationController, rc: RideController) =>
{
    const layout =
    box({
        text: "Station styles",
        content:
            horizontal({
                height: 10,
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
                        }
                    }),
                    toggle({
                        isPressed:compute(sc.automaticallyApply,(enabled)=>enabled),
                        onChange: (isPressed) =>
                        {
                            sc.automaticallyApply.set(isPressed)
                            if (isPressed) ColourChange.changeRideStationStyle(rc.all.get(), sc)
                        }
                    })
                ]
            })
    })

    return layout
}

export default stationStyleElements
