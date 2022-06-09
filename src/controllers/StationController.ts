import { Store, store } from "openrct2-flexui";
import BaseController from "./BaseController";

export default class StationController extends BaseController<LoadedObject> {
    automaticallyApply: Store<boolean>;

    constructor() {
        super(context.getAllObjects("station"));
        // todo don't hard code in false here
        this.automaticallyApply = store<boolean>(false);
        this.controllerKeys = {
            stationSelectedIndex: this.selectedIndex,
            stationAutomaticallyApply: this.automaticallyApply,
        };
    }
}
