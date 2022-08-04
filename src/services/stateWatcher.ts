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

  private onParkStartHook: IDisposable;

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

    this.onParkStartHook = context.subscribe("interval.tick", () =>
      this.findStartingDay()
    );

    this.onSaveHook = context.subscribe("map.save", () => this.onSave());

    this.eventStack = [];

    // intentionally param-reassign WindowWatcher and therefore window functions
    /* eslint-disable no-param-reassign */
    WindowWatcher.onWindowUpdate = (): void => this.onWindowUpdate();
    WindowWatcher.onWindowOpen = (): void => this.onWindowOpen();
    this.dayHook = context.subscribe("interval.day", () => this.onDayHook());
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

  private findStartingDay = () => {
    debug(`Starting Day/Month/Yeare: ${date.day} ${date.month} ${date.year}`);
    const { day, month, year } = date;
    if (day === 1 || month === 0 || year === 1) {
      debug(
        `New park, so marking all existing rides as 'painted'
         so they don't get accidentally repainted and mess up the theme.`
      );
      ColourChange.markAllRidesAsPainted(this.featureController.rideController);
    } else
      debug(
        `Not a brand new park, so not marking all rides as having been painted.`
      );
    this.onParkStartHook.dispose();
  };

  /**
   * Adds a given GameAction to a stack of length 4.
   * The stack is used to understand whether a ride's name was set manually or via creating a preset ride.
   * See {@link StateWatcher.onActionExecuted} case "ridesetname".
   */
  private addToEventStack(action: ActionType) {
    this.eventStack.push(action);
    if (this.eventStack.length > 4) this.eventStack.shift();
    // debug(`Event Stack: ${this.eventStack}`);
  }

  private attemptToPaintNewRide(newRideID: number) {
    // guard in case rideID === 0 so it doesn't misinterpret a falsy value
    if (
      typeof newRideID !== "undefined" &&
      this.featureController.settingsController.getValue("paintBrantNewRides")
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
      // if a new ride was created, update the rideModel and paint it if "paintBrandNewRides" is true
      case "ridecreate": {
        this.featureController.rideController.updateRideModel();
        // if the event's flags are nonzero, it means they weren't actually executed and should be ignored
        const args = event.args as { flags: number };
        if (args?.flags > 1) {
          return;
        }

        this.addToEventStack(action);
        const newRideID = (event.result as { ride: number }).ride;

        // if all rides were selected, include this one too
        const rc = this.featureController.rideController;
        const numSelectedRides = rc.selectedRides.get().length;
        const numAllRides = rc.all.get().length;
        if (numSelectedRides + 1 === numAllRides) {
          debug(
            `all rides were selected when this was built, so auto-selecting it as well.`
          );
          rc.selectedRides.set(rc.all.get());
        }
        this.attemptToPaintNewRide(newRideID);
        break;
      }

      // if a ride is demolished, update the rideController and deselect it if necessary
      case "ridedemolish": {
        this.featureController.rideController.updateRideModel();
        // this.addToEventStack(action);
        // if the event's flags are not 1, it means they weren't actually executed and should be ignored
        const args = event.args as { flags: number };

        if (args?.flags < 1) {
          this.addToEventStack(action);
        }

        if (args?.flags !== 1) {
          return;
        }

        // if the ride was selected, make sure it disappears from RideRepaintSection
        const rc = this.featureController.rideController;
        const deletedRideID = (event.args as { ride: number }).ride;
        const deletedRide = rc.selectedRides
          .get()
          .filter((ride) => ride.id === deletedRideID)[0];

        // if the ride was selected
        if (deletedRide) {
          const deletedRideIndex = rc.selectedRides.get().indexOf(deletedRide);
          if (deletedRideIndex > -1) {
            rc.selectedRides.splice(deletedRideIndex, 1);
          }
        }
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

        // check if the ride was selected. if so, pass rc.selectedRides the current name
        // if the ride was selected, make sure it disappears from RideRepaintSection
        // code was basically copied from case "ridedemolish", so look there for inspiration
        const rc = this.featureController.rideController;
        const newRideID = (event.args as { ride: number }).ride;
        const newRideName = (event.args as { name: string }).name;
        const newRide = rc.selectedRides
          .get()
          .filter((ride) => ride.id === newRideID)[0];

        // if the ride was selected
        if (newRide) {
          const newRideIndex = rc.selectedRides.get().indexOf(newRide);
          if (newRideIndex > -1) {
            // creating new array since Array.slice mutates the original rather than returning what we want
            const currentSelectedRides = rc.selectedRides.get();
            currentSelectedRides[newRideIndex].name = newRideName;
            rc.selectedRides.set(
              // honestly not sure why this map worked where just putting in the array raw didn't,
              // but for some reason it doesn't work with just putting in currentlSelectedRides
              currentSelectedRides.map((ride) => ride)
            );
          }
        }

        break;
      }

      default: {
        // debug(`<${action}>\n\t- type: ${event.type}
        // \t- args: ${JSON.stringify(
        //     event.args
        // )}\n\t- result: ${JSON.stringify(event.result)}`);
      }
    }
  }

  /**
   * Triggers every game tick. Does not trigger in pause mode.
   */
  private onGameTickUpdate(): void {
    if (this.isDisposed) return;
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
    this.featureController.themeController.subscribeToAdditionalThemes();
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
