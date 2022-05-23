import { Theme, themes } from "../themeSettings/themes";
import BaseController from "./BaseController";

export default class ThemeController extends BaseController<Theme>
{
    constructor()
    {
        super({library:themes});
        this.controllerKeys = {
            "themeSelectedIndex": this.selectedIndex,
            }
    }
}
