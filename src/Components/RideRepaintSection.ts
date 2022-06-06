/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
import {
    button,
    horizontal,
    vertical,
    label,
    colourPicker,
    Colour,
    box,
    Store,
    compute,
    store,
    window,
} from "openrct2-flexui";
import ColourChange from "../themeSettings/ColourChange";
import { debug } from "../helpers/logger";
import FeatureController from "../controllers/FeatureController";

class RidePaintController {
    rows: number;

    columns: number;

    numRidesInView: number;

    currentPage: Store<number>;

    totalPages: Store<number>;

    visibleRides: Store<Ride[]>;

    selectedRides: Store<Ride[]>;

    paintToggle: Store<number>;

    featureController: FeatureController;

    constructor(
        fc: FeatureController,
        numRows: number = 5,
        numCols: number = 2
    ) {
        this.rows = numRows;
        this.columns = numCols;
        this.numRidesInView = this.rows * this.columns;
        this.currentPage = store<number>(0);
        this.featureController = fc;
        this.selectedRides = compute(
            fc.rideController.selectedRides,
            (rides) => rides
        );
        this.totalPages = store<number>(1);
        this.visibleRides = store<Ride[]>([]);
        this.paintToggle = fc.rideController.paintToggle;
    }

    computeVisibility(index: number) {
        return compute(this.selectedRides, (rides) =>
            rides[index] ? "visible" : "hidden"
        );
    }

    openRideWindow(index: number) {
        const thisRide = this.selectedRides.get()[index];
        const { start } = thisRide.stations[0];
        if (!start) return;
        debug(`scrollto ${thisRide.name}`);
        ui.mainViewport.scrollTo({
            x: start.x,
            y: start.y,
            z: start.z,
        });
    }

    generateRideRepaintElement(index: number) {
        const element = button({
            image: 5173,
            border: true,
            width: 25,
            onClick: () =>
                ColourChange.colourRides(this.featureController, [
                    this.selectedRides.get()[index],
                ]),
            visibility: this.computeVisibility(index),
        });
        return element;
    }

    generateNameElement(index: number) {
        const element = button({
            border: false,
            padding: { top: 5 },
            text: compute(
                this.selectedRides,
                (rides) => rides[index]?.name || "No selected ride"
            ),
            visibility: this.computeVisibility(index),
            onClick: () => this.openRideWindow(index),
        });
        return element;
    }

    generateRidePieceElement(index: number, ridePieceNumber: number) {
        const element = colourPicker({
            visibility: this.computeVisibility(index),
            padding: { top: 5 },
            colour: compute(
                this.selectedRides,
                this.paintToggle,
                (selectedRides) =>
                    selectedRides[index]
                        ? getRideColourPart(
                              selectedRides[index],
                              ridePieceNumber
                          )
                        : 0
            ),
            onChange: (newColour) =>
                compute(this.selectedRides, (rides) => {
                    if (rides[index]) {
                        setRideColourPart(
                            rides[index],
                            ridePieceNumber,
                            newColour
                        );
                    }
                }),
        });
        return element;
    }

    generateRidePaintRowComponent(index: number) {
        const element = horizontal({
            height: 25,
            content: [
                this.generateNameElement(index),
                this.generateRidePieceElement(index, 0),
                this.generateRidePieceElement(index, 1),
                this.generateRidePieceElement(index, 2),
                this.generateRidePieceElement(index, 3),
                this.generateRidePieceElement(index, 4),
                this.generateRidePieceElement(index, 5),
                this.generateRideRepaintElement(index),
            ],
        });
        return element;
    }

    layoutTest() {
        const rideLayout = new Array(15);
        // const rideLayout = new Array(this.numRidesInView);

        for (let k = 0; k < rideLayout.length; k += 1) {
            rideLayout[k] = this.generateRidePaintRowComponent(k);
        }
        return vertical({
            content: [...rideLayout],
        });
    }
    // END OF CLASS
}

const setRideColourPart = (ride: Ride, partNumber: number, colour: number) => {
    switch (partNumber) {
        case 0:
            ColourChange.setRideColour(ride, colour, -1, -1, -1, -1, -1);
            break;
        case 1:
            ColourChange.setRideColour(ride, -1, colour, -1, -1, -1, -1);
            break;
        case 2:
            ColourChange.setRideColour(ride, -1, -1, colour, -1, -1, -1);
            break;
        case 3:
            ColourChange.setRideColour(ride, -1, -1, -1, colour, -1, -1);
            break;
        case 4:
            ColourChange.setRideColour(ride, -1, -1, -1, -1, colour, -1);
            break;
        case 5:
            ColourChange.setRideColour(ride, -1, -1, -1, -1, -1, colour);
            break;
        default:
            break;
    }
};

const getRideColourPart = (ride: Ride, partNumber: number) => {
    switch (partNumber) {
        case 0:
            return ride.colourSchemes[0].main;
        case 1:
            return ride.colourSchemes[0].additional;
        case 2:
            return ride.colourSchemes[0].supports;
        case 3:
            return ride.vehicleColours[0].body;
        case 4:
            return ride.vehicleColours[0].trim;
        case 5:
            return ride.vehicleColours[0].ternary;
        default: {
            return 9;
        }
    }
};

export default RidePaintController;
