import { Store, store, Colour } from 'openrct2-flexui';
import { Mode, modes } from '../themeSettings/modes';
import BaseController from './BaseController';

export default class ModeController extends BaseController<Mode>
{
    selectedCustomColours: Store<Colour[]>;

    selectedColoursEnabled: Store<boolean[]>;

    constructor()
    {
    super({library:modes})
    this.selectedCustomColours = store<Colour[]>([2,0,2,2,0,2]);
    this.selectedColoursEnabled = store<boolean[]>([true,false,true,true,false,true]);
    this.controllerKeys = {
        "themeSelectedIndex": this.selectedIndex,
        "modeSelectedCustomColours": this.selectedCustomColours,
        "modeSelectedColoursEnabled": this.selectedColoursEnabled
        }
    }
}
