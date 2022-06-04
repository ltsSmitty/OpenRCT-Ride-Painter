/* eslint-disable no-use-before-define */
import { debug } from "../helpers/logger";
import { WindowWatcher } from "../window";
import FeatureController from "../controllers/FeatureController";
import ColourChange from "../themeSettings/ColourChange";
import arrayEquals from "../helpers/ArrayHelpers";

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

    /**
     * Adds a given GameAction to a stack of length 4.
     * The stack is used to understand whether a ride's name was set manually or via creating a preset ride.
     * See {@link StateWatcher.onActionExecuted} case "ridesetname".
     */
    private addToEventStack(action: ActionType) {
        this.eventStack.push(action);
        if (this.eventStack.length > 4) this.eventStack.shift();
        debug(`Event Stack: ${this.eventStack}`);
    }

    private attemptToPaintNewRide(newRideID: number) {
        // guard in case rideID === 0 so it doesn't misinterpret a falsy value
        if (
            typeof newRideID !== "undefined" &&
            this.featureController.settingsController.getValue(
                "paintBrantNewRides"
            )
        ) {
            const newRide = map.getRide(newRideID);
            ColourChange.colourRides(this.featureController, [newRide]);
        }
    }

    /**
     * Triggers for every executed player action.
     * @param event The arguments describing the executed action.
     */
    private onActionExecuted(event: GameActionEventArgs): void {
        if (this.isDisposed) return;

        const action = event.action as ActionType;
        switch (action) {
            // if a ride was created or demolished, update the rideModel
            // if a new ride was created, paint it if "paintBrandNewRides" is true
            case "ridecreate":
            case "ridedemolish": {
                this.featureController.rideController.updateRideModel();
                // if the event's flags are nonzero, it means they weren't actually executed and should be ignored
                const args = event.args as { flags: number };
                if (args?.flags > 0) {
                    return;
                }

                this.addToEventStack(action);
                const newRideID = (event.result as { ride: number }).ride;
                this.attemptToPaintNewRide(newRideID);
                break;
            }
            // if a ride was created from a pre-built design, the paint needs to be done after "ridesetname" instead of
            // during "ridecreate" due to things
            case "ridesetname": {
                // if this event's flags are nonzero, it means they weren't actually executed and should be ignored
                const args = event.args as { flags: number };
                if (args?.flags > 0) {
                    return;
                }
                this.addToEventStack(action);

                // check if the ride's name was set as part of the build process
                // for some reason, this specific set of actions happens every time when building a premade track
                if (
                    arrayEquals(this.eventStack, [
                        "ridecreate",
                        "ridedemolish",
                        "ridecreate",
                        "ridesetname",
                    ])
                ) {
                    const newRideID = (event.args as { ride: number }).ride;
                    this.attemptToPaintNewRide(newRideID);
                }
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
