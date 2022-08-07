import { ArrayStore, Store, arrayStore, store } from "openrct2-flexui";
import RideController from "../controllers/RideController";
import { debug } from "./logger";
import { convertRideToProxy, RideProxy } from "./RideProxy";
import ColourChange from "../themeSettings/ColourChange";

class RideHistory {
  /**
   * Version control history. Adds a new entry each time a ride/rides are painted.
   */
  ridePaintHistory: ArrayStore<RideProxy[]>;

  /**
   * Version control pointer to track the place in the undo/redo history
   */
  undoPointer: Store<number>;

  rc: RideController;

  constructor(rc: RideController) {
    this.ridePaintHistory = arrayStore<RideProxy[]>([]);
    this.undoPointer = store<number>(0);
    this.rc = rc;
  }

  /**
   * Add the rides being painted to the paint version control.
   */
  pushRidesToPaintHistory = (rides: Ride[]) => {
    // convert to a shallower version of ride for cheaper storage
    const ridesProxy = rides.map((ride) => convertRideToProxy(ride));
    const pointer = this.undoPointer;
    const startingIndex = pointer.get();
    // used for the splice to know where to start inserting/deleting.
    const deletionPoint = this.ridePaintHistory.get().length - pointer.get();

    // if the user has undone some paints (and therefore is not at the top of the stack),
    // those paint histories will be lost
    const numPaints = this.ridePaintHistory.splice(
      startingIndex,
      deletionPoint,
      ridesProxy
    );
    // move the pointer up by 1 to point at the newest paint job
    pointer.set(pointer.get() + 1);

    debug(
      `\nPushed ${rides.length} rides to paint history in this batch.
      ${numPaints.length} paint histories were discarded.`
    );
  };

  public undoLastPaint = () => {
    const pointer = this.undoPointer;

    // if there have been no paints
    // or if you've undone all the way back to the beginning
    if (pointer.get() <= 0) {
      debug(`there are no paints to undo`);
      return;
    }

    // if it's on the most recent paint, add it to the array right before undoing
    debug(`\nUndoing paint.`);

    if (pointer.get() === this.ridePaintHistory.get().length) {
      debug(`At stack header, so adding current paint to the stack.`);
      this.pushRidesToPaintHistory(this.rc.selectedRides.get());
      // Compensation for pointer being incremented during pushRidesToPaintHistory()
      pointer.set(pointer.get() - 1);
    }
    pointer.set(pointer.get() - 1);
    const ridesToUndoPaint = this.ridePaintHistory.get()[pointer.get()];
    ridesToUndoPaint.map((ride) =>
      ColourChange.setRideColour(
        ride as Ride,
        ...this.getColoursFromProxy(ride)
      )
    );
    // refresh selected rides to update right column
    this.rc.selectedRides.set([...this.rc.selectedRides.get()]);
  };

  public redoPaint = () => {
    const pointerNumber = this.undoPointer.get();
    // make sure pointer isn't already at the head
    if (pointerNumber >= this.ridePaintHistory.get().length) {
      debug(`there are no paints to redo`);
      return;
    }

    this.undoPointer.set(pointerNumber + 1);
    // get the rides to redo painting
    const ridesToUndoPaint =
      this.ridePaintHistory.get()[this.undoPointer.get()];
    debug(`\nRedoing paintjob.`);
    debug(
      `${ridesToUndoPaint.length} rides which will be brought back to redone state.`
    );

    if (!ridesToUndoPaint) {
      debug(`no rides to undo`);
      return;
    }
    ridesToUndoPaint.map((ride) =>
      ColourChange.setRideColour(
        ride as Ride,
        ...this.getColoursFromProxy(ride)
      )
    );
    // refresh selected rides to update right column
    this.rc.selectedRides.set([...this.rc.selectedRides.get()]);
  };

  private getColoursFromProxy = (ride: RideProxy) => [
    ride.colourSchemes[0].main,
    ride.colourSchemes[0].additional,
    ride.colourSchemes[0].supports,
    ride.vehicleColours[0].body,
    ride.vehicleColours[0].trim,
    ride.vehicleColours[0].tertiary,
  ];
}

export default RideHistory;
