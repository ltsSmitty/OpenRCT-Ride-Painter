import { listview, compute } from "openrct2-flexui";
import { FeatureController } from "../controllers/Controllers";
import { debug } from "../helpers/logger";
import ColourChange from "../themeSettings/ColourChange";

const getRideColours = (ride: Ride) =>
[
        ride.name,
        ride.colourSchemes[0].main.toString(),
        ride.colourSchemes[0].additional.toString(),
        ride.colourSchemes[0].supports.toString(),
        ride.vehicleColours[0].body.toString(),
        ride.vehicleColours[0].trim.toString(),
        ride.vehicleColours[0].ternary.toString()] as ListViewItem

const listElement = (fc: FeatureController) =>
{
    debug("hello");
    return listview({
        columns: [
            {
            header: "Selected Rides",
            width: 150,

            },
            {header: "colour 1"},
            {header: "colour 2"},
            {header: "colour 3"},
            {header: "colour 4"},
            {header: "colour 5"},
            {header: "colour 6"},
        ],
        items: compute(fc.rideController.selectedRides,(rides=>
            rides?.map(ride=>getRideColours(ride))))
})
}

export default listElement
