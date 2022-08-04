import { Colour, ArrayStore, arrayStore } from "openrct2-flexui";
import { Mode, modes } from "../themeSettings/modes";
import BaseController from "./BaseController";

// Here is where you can set the default starting mode.
// The values each represent the different modes
// 	monoChromaticMode,	randomMode, buildOrderMode, customPatternMode, shuffleMode
// i.e. 4 is shuffleMode
let defaultStartingMode = 4;

export default class ModeController extends BaseController<Mode> {
  selectedCustomColours: ArrayStore<Colour>;

  selectedColoursEnabled: ArrayStore<boolean>;

  constructor() {
    super(modes);

    // set the default starting mode & guard in case the index is out of bounds
    if (defaultStartingMode > modes.length - 1) defaultStartingMode = 0;
    this.selectedIndex.set(defaultStartingMode);
    this.selected.set(modes[this.selectedIndex.get()]);

    // set up the default starting custom colours and activation pattern
    this.selectedCustomColours = arrayStore<Colour>([2, 0, 2, 2, 0, 2]);
    this.selectedColoursEnabled = arrayStore<boolean>([
      true,
      false,
      true,
      true,
      false,
      true,
    ]);

    // initialize controller keys for saving to ParkStorage
    this.controllerKeys = {
      modeSelectedIndex: this.selectedIndex,
      modeSelectedCustomColours: this.selectedCustomColours,
      modeSelectedColoursEnabled: this.selectedColoursEnabled,
    };
  }
}
