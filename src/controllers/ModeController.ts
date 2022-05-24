import { Store, store, Colour } from 'openrct2-flexui';
import { Mode, modes } from '../themeSettings/modes';
import BaseController from './BaseController';

// Here is where you can set the default starting mode.
// The values each represent the different modes
// 	monoChromaticMode,	randomMode, buildOrderMode, customPatternMode, shuffleMode
// i.e. 4 is shuffleMode
const defaultStartingMode = 4;

export default class ModeController extends BaseController<Mode>
{
    selectedCustomColours: Store<Colour[]>;

    selectedColoursEnabled: Store<boolean[]>;

    constructor()
    {
    super({library:modes})
    this.selectedIndex.set(defaultStartingMode);
    this.selectedCustomColours = store<Colour[]>([2,0,2,2,0,2]);
    this.selectedColoursEnabled = store<boolean[]>([true,false,true,true,false,true]);
    this.controllerKeys = {
        "modeSelectedIndex": this.selectedIndex,
        "modeSelectedCustomColours": this.selectedCustomColours,
        "modeSelectedColoursEnabled": this.selectedColoursEnabled
        }
    }
}
