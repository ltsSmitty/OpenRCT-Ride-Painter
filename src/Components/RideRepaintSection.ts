/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable lines-between-class-members */
import { horizontal, vertical, label, colourPicker, Colour, box, Store, compute, store } from "openrct2-flexui";
import ColourChange from "../themeSettings/ColourChange";
import { debug } from "../helpers/logger";
import { RideController } from '../controllers/Controllers';

// const rows: number;
// const columns: number;
// const numRidesInView: number;
// const currentPage: Store<number>;
// const totalPages: Store<number>;
// const visibleRides: Store<Ride[]>;
// const selectedRides: Store<Ride[]>;

class RidePaintController
{
    rows: number;
    columns: number;
    numRidesInView: number;
    currentPage: Store<number>;
    totalPages: Store<number>;
    visibleRides: Store<Ride[]>;
    selectedRides: Store<Ride[]>;


    constructor(rc: RideController, numRows: number = 5, numCols: number = 2)
    {
        this.rows = numRows;
        this.columns = numCols;
        this.numRidesInView = this.rows * this.columns
        this.currentPage = store<number>(0);
        this.selectedRides = rc.selectedRides;
        this.totalPages = store<number>(1);
        this.visibleRides = store<Ride[]>([]);
    }

    computeVisibility(index: number)
    {
        return compute(this.selectedRides, rides=>
            rides[index] ? "visible" : "none")
    }

    generateNameElement(index: number)
    {
        const element = label({
            text: compute(this.selectedRides, rides =>
                rides[index]?.name || "No selected ride"),
            visibility: this.computeVisibility(index)
        })
        return element
    }

    generateRidePieceElement(index: number, ridePieceNumber:number)
    {
        const element = colourPicker({
            visibility: this.computeVisibility(index),
            colour: compute(this.selectedRides, rides=>
                rides[index] ? getRideColourPart(rides[index], ridePieceNumber) : 0
                ),
            onChange: newColour => compute(this.selectedRides, rides =>
                {
                    if (rides[index])
                    {
                        setRideColourPart(rides[index], ridePieceNumber, newColour)
                    }
                })
        })
    return element
    }

    generateRidePaintRowComponent(index: number)
    {
        const element = horizontal({
            content: [
                this.generateNameElement(index),
                this.generateRidePieceElement(index, 0),
                this.generateRidePieceElement(index, 1),
                this.generateRidePieceElement(index, 2),
                this.generateRidePieceElement(index, 3),
                this.generateRidePieceElement(index, 4),
                this.generateRidePieceElement(index, 5),
            ]
        });
        return element
    }


    layoutTest(rc: RideController)
    {
        const rideLayout = new Array(25);
        // const rideLayout = new Array(this.numRidesInView);

        for (let k = 0; k<rideLayout.length;k+=1)
        {
            rideLayout[k] = this.generateRidePaintRowComponent(k)
            label({text: compute(rc.all, rides =>
                rides[k]?.name || "no ride")});
        }
        // debug(`layout: ${JSON.stringify(rideLayout)}`)
        return vertical({
            content: [...rideLayout]
        })
    }
// END OF CLASS
}

const setRideColourPart = (ride: Ride, partNumber: number, colour: number) =>
{
    switch(partNumber)
    {
        case 0: ColourChange.setRideColour(ride, colour, -1, -1, -1, -1, -1); break;
        case 1: ColourChange.setRideColour(ride, -1, colour, -1, -1, -1, -1); break;
        case 2: ColourChange.setRideColour(ride, -1, -1, colour, -1, -1, -1); break;
        case 3: ColourChange.setRideColour(ride, -1, -1, -1, colour, -1, -1); break;
        case 4: ColourChange.setRideColour(ride, -1, -1, -1, -1, colour, -1); break;
        case 5: ColourChange.setRideColour(ride, -1, -1, -1, -1, -1, colour); break;
        default: break;
    }
}

const getRideColourPart = (ride: Ride,  partNumber: number ) =>
{
    switch(partNumber)
    {
        case 0: return ride.colourSchemes[0].main;
        case 1: return ride.colourSchemes[0].additional;
        case 2: return ride.colourSchemes[0].supports;
        case 3: return ride.vehicleColours[0].body;
        case 4: return ride.vehicleColours[0].trim;
        case 5: return ride.vehicleColours[0].ternary;
        default: { return 9}
    }
}

export default RidePaintController


