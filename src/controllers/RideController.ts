import { Store, store, ArrayStore, arrayStore } from "openrct2-flexui";
import BaseController from "./BaseController";
import { RideType } from "../helpers/RideType";
import { debug } from "../helpers/logger";
import RideHistory from "../helpers/RideHistory";

export default class RideController extends BaseController<Ride> {
  selectedRides: ArrayStore<Ride>;

  selectedText: Store<string>;

  paintedRides: ArrayStore<Ride | null>;

  allRideTypes!: ArrayStore<RideType>;

  paintToggle: Store<number>;

  rideHistory: RideHistory;

  constructor() {
    const allRides = map.rides.filter((ride) => ride.classification === "ride");
    super(allRides);

    debug(`RideController, all: ${this.all.get().map((ride) => ride.name)}`);
    // set the ride types
    this.allRideTypes = arrayStore<RideType>([]);
    this.updateAllRideTypes();
    this.selected = store<Ride | null>(null);
    this.selectedRides = arrayStore<Ride>([]);
    this.paintedRides = arrayStore<Ride | null>([]);
    this.selectedText = store<string>("");
    this.paintToggle = store<number>(0);
    this.rideHistory = new RideHistory(this);
  }

  /**
   * Update the model's values for rideController.all and rideController.allRideTypes
   */
  updateRideModel() {
    this.updateAllRides();
    this.updateAllRideTypes();
  }

  private updateAllRides() {
    const allRides = map.rides.filter((ride) => ride.classification === "ride");
    this.all.set(allRides);
  }

  private updateAllRideTypes() {
    const allRideTypes = this.all.get().map((ride) => ride.type);
    const uniqueRideTypes = allRideTypes
      // get the unique ride types
      .filter(onlyUnique)
      // get only non-zero/truthy values
      .filter((n) => n);
    this.allRideTypes.set(uniqueRideTypes);
    // debug(`<Controller>rc.allRideTypes updated: ${uniqueRideTypes}`)
    return uniqueRideTypes;
    /**
     * Helper to get unique ride types
     */
    function onlyUnique(value: any, index: any, self: any) {
      return self.indexOf(value) === index;
    }
  }

  /**
   * Set this.selectedText to display which rides are selected, e.g. "3/10 rides selected"
   */
  setSelectedRidesText() {
    const selectedRides = this.selectedRides.get() || [];
    this.selectedText.set(
      `{BLACK}${selectedRides.length}/${this.all.get().length} rides selected`
    );
  }

  override getActive() {
    return {
      all: this.all,
      selected: this.selected,
      selectedIndex: this.selectedIndex,
      allRideTypes: this.allRideTypes,
      selectedRides: this.selectedRides,
      selectedText: this.selectedText,
    };
  }
}
