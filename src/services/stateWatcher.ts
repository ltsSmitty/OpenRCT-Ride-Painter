/* eslint-disable lines-between-class-members */
/* eslint-disable no-use-before-define */
import { debug } from "../helpers/logger";
import { WindowWatcher } from "../window";
import FeatureController from "../controllers/FeatureController";
import ColourChange from "../themeSettings/ColourChange";

/**
 * Watches the state of the game, and updates relevant services if necessary.
 */
export default class StateWatcher implements IDisposable {
    private onActionHook: IDisposable;
    private onUpdateHook: IDisposable;
    private isDisposed: boolean = false;
    private onSaveHook: IDisposable;
    private dayHook;
    private eventStack: ActionType[];
    featureController: FeatureController;

    constructor(fc: FeatureController) {
        debug("(watcher) Watcher initialized");
        this.featureController = fc;
        this.onActionHook = context.subscribe("action.execute", (e) =>
            this.onActionExecuted(e)
        );
        this.onUpdateHook = context.subscribe("interval.tick", () =>
            this.onGameTickUpdate()
        );
        this.onSaveHook = context.subscribe("map.save", () => this.onSave());

        this.eventStack = [];

        // intentionally param-reassign WindowWatcher and therefore window functions
        /* eslint-disable no-param-reassign */
        WindowWatcher.onWindowUpdate = (): void => this.onWindowUpdate();
        WindowWatcher.onWindowOpen = (): void => this.onWindowOpen();
        this.dayHook = context.subscribe("interval.day", () =>
            this.onDayHook()
        );
    }

    dispose(): void {
        this.onActionHook.dispose();
        this.onUpdateHook.dispose();
        this.isDisposed = true;
    }

    private onSave(): void {
        if (this.isDisposed) return;
        this.featureController.save();
    }

    private addToEventStack(action: ActionType) {
        this.eventStack.push(action);
        if (this.eventStack.length > 4) this.eventStack.shift();
        debug(`Event Stack: ${this.eventStack}`);
    }

    /**
     * Triggers for every executed player action.
     * @param event The arguments describing the executed action.
     */
    private onActionExecuted(event: GameActionEventArgs): void {
        if (this.isDisposed) return;

        const action = event.action as ActionType;
        switch (action) {
            case "ridecreate":
            case "ridedemolish": {
                // track which event this was to see if an upcoming "ridesetname" should trigger a ride paint
                // 1 update list of all rides
                this.featureController.rideController.updateRideModel();
                const args = event.args as { flags: number };
                if (args?.flags > 0) {
                    debug(`flag ${args.flags} > 0. building`);
                    return;
                }
                debug(`flag ${args.flags} !>0, so continuing`);

                this.addToEventStack(action);
                const newRideID = (event.result as { ride: number }).ride;
                // but might be undefined
                // need to guard in case rideID === 0
                if (
                    typeof newRideID !== "undefined" &&
                    this.featureController.settingsController.getValue(
                        "paintBrantNewRides"
                    )
                ) {
                    // 2 check if paintBrandNewRides is active and paint the new ride if so
                    const newRide = map.getRide(newRideID);
                    ColourChange.colourRides(this.featureController, [newRide]);
                    // todo build order isn't working any more
                }
                break;
            }
            case "ridesetname": {
                const args = event.args as { flags: number };
                if (args?.flags > 0) {
                    return;
                }
                debug(`flag ${args.flags} !>0, so continuing`);
                debug(`<${action}>\n\t- type: ${event.type}
                 \t- args: ${JSON.stringify(
                     event.args
                 )}\n\t- result: ${JSON.stringify(event.result)}`);
                this.addToEventStack(action);
                break;
            }
            default: {
                // return;
            }
        }

        // debug(`<${action}>\n\t- type: ${event.type}
        //  \t- args: ${JSON.stringify(event.args)}\n\t- result: ${JSON.stringify(
        //     event.result
        // )}`);
    }

    /**
     * Triggers every game tick. Does not trigger in pause mode.
     */
    private onGameTickUpdate(): void {
        if (this.isDisposed) return;

        // todo is this needed?
    }

    /**
     * Triggers every tick the window UI is updated.
     */
    private onWindowUpdate(): void {
        if (this.isDisposed) return;

        // update how many rides are selected
        this.featureController.rideController.setSelectedRidesText();
    }

    private onWindowOpen(): void {
        if (this.isDisposed) return;
        debug(`window opened`);
        this.featureController.settingsController.subToSettingsChange();
    }

    private onDayHook() {
        if (
            this.featureController.settingsController.shouldAutomaticallyPaintToday()
        ) {
            debug(`Repainting all rides today`);
            ColourChange.colourRides(
                this.featureController,
                this.featureController.rideController.all.get()
            );
        }
    }
}
