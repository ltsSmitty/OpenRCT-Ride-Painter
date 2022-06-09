import { Grouping, groupings } from "../themeSettings/groupings";
import BaseController from "./BaseController";

export default class GroupingController extends BaseController<
    Grouping<number | string>
> {
    constructor() {
        super(groupings);
        this.controllerKeys = {
            themeSelectedIndex: this.selectedIndex,
        };
    }
}
