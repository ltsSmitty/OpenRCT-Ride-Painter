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
    Scale,
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

    columnWidths: Scale[] = ["3w", "1w", "1w"];

    rideRepaintElementWidth = 25;

    numRidesInView: number;

    currentPage: Store<number>;

    totalPages: Store<number>;

    visibleRides: Store<Ride[]>;

    selectedRides: Store<Ride[]>;

    paintToggle: Store<number>;

    featureController: FeatureController;

    constructor(fc: FeatureController, numRows: number = 15) {
        this.rows = numRows;
        this.numRidesInView = this.rows;
        this.currentPage = store<number>(0);
        this.featureController = fc;
        this.selectedRides = fc.rideController.selectedRides;
        this.totalPages = store<number>(1);
        this.visibleRides = store<Ride[]>([]);
        this.paintToggle = fc.rideController.paintToggle;
    }

    computeVisibility(index: number) {
        return compute(this.selectedRides, (rides) =>
            rides[index] ? "visible" : "hidden"
        );
    }

    scrollToRide(index: number) {
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

    // eslint-disable-next-line class-methods-use-this
    generateHeaderElement() {
        const element = horizontal({
            content: [
                label({
                    alignment: "centred",
                    width: this.columnWidths[0],
                    text: "Ride",
                }),
                label({
                    alignment: "centred",
                    width: this.columnWidths[1],
                    text: "Track ", // extra space added for alignment reasons
                }),
                label({
                    alignment: "centred",
                    width: this.columnWidths[2],
                    text: "Cars",
                }),
                label({
                    text: "repaint",
                    visibility: "hidden",
                    width: this.rideRepaintElementWidth,
                }),
            ],
        });
        return element;
    }

    generateRideRepaintElement(index: number) {
        const element = button({
            image: 5173,
            border: true,
            width: this.rideRepaintElementWidth,
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
            width: this.columnWidths[0],
            border: false,
            padding: { top: 5 },
            text: compute(
                this.selectedRides,
                (rides) => rides[index]?.name || "No selected ride"
            ),
            visibility: this.computeVisibility(index),
            onClick: () => this.scrollToRide(index),
        });
        return element;
    }

    generateTrackColourElements(index: number) {
        const element = horizontal({
            width: this.columnWidths[1],
            content: [
                this.generateRidePieceElement(index, 0),
                this.generateRidePieceElement(index, 1),
                this.generateRidePieceElement(index, 2),
            ],
        });
        return element;
    }

    generateCarColourElements(index: number) {
        const element = horizontal({
            width: this.columnWidths[2],
            content: [
                this.generateRidePieceElement(index, 3),
                this.generateRidePieceElement(index, 4),
                this.generateRidePieceElement(index, 5),
            ],
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
                this.generateTrackColourElements(index),
                this.generateCarColourElements(index),
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
            content: [this.generateHeaderElement(), ...rideLayout],
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
            return ride.vehicleColours[0].tertiary;
        default: {
            return 9;
        }
    }
};

export default RidePaintController;
