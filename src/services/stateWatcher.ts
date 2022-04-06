/* eslint-disable lines-between-class-members */
/* eslint-disable no-use-before-define */
import { debug } from "../helpers/logger";
import { WindowWatcher } from "../window";
import { FeatureController, RideController, SettingsController } from '../controllers/Controllers';
import ColourChange from "../themeSettings/ColourChange";

/**
 * Watches the state of the game, and updates relevant services if necessary.
 */
 export default class StateWatcher implements IDisposable
 {
     private onActionHook: IDisposable;
     private onUpdateHook: IDisposable;
     private isDisposed: boolean = false;
     private onSaveHook: IDisposable;
     featureController: FeatureController;

     constructor(fc: FeatureController)
     {
        this.featureController = fc;
        debug("(watcher) Watcher initialized");
        this.onActionHook = context.subscribe("action.execute", e => this.onActionExecuted(e));
        this.onUpdateHook = context.subscribe("interval.tick", () => this.onGameTickUpdate());
        this.onSaveHook = context.subscribe("map.save",() => this.onSave())
         // intentionally param-reassign WindowWatcher and therefore window functions
         /* eslint-disable no-param-reassign */
         WindowWatcher.onWindowUpdate = ():void => this.onWindowUpdate();
         WindowWatcher.onWindowOpen = ():void => this.onWindowOpen();
     }


     dispose(): void
     {
         this.onActionHook.dispose();
         this.onUpdateHook.dispose();
         this.isDisposed = true;
     }

     private onSave(): void
     {
        if (this.isDisposed) return;
        this.featureController.save()
     }

     /**
      * Triggers for every executed player action.
      * @param event The arguments describing the executed action.
      */
     private onActionExecuted(event: GameActionEventArgs): void
     {
         if (this.isDisposed) return;

         const action = event.action as ActionType;
         switch (action)
         {

            case "ridecreate":
            case "ridedemolish":
            case "ridesetname":
            // 1. update list of all rides
            // 2. check if paintBrandNewRides is active and paint the new ride if so
            {
                this.featureController.rideController.updateRideModel()
                this.featureController.settingsController.debug()
                const newRideID = (event.result as {ride:number}).ride // but might be undefined
                // need to guard in case rideID === 0
                if (typeof newRideID !== 'undefined' &&
                    this.featureController.settingsController.getPaintBrandNewRides())
                    {
                        const newRide = map.getRide(newRideID);
                        ColourChange.colourRides(this.featureController,[newRide])
                        // todo build order isn't working any more
                    }
                break;
             }
             default: {return}
         }

         debug(`<${action}>\n\t- type: ${event.type}
         \t- args: ${JSON.stringify(event.args)}\n\t- result: ${JSON.stringify(event.result)}`);
     }


     /**
      * Triggers every game tick. Does not trigger in pause mode.
      */
     private onGameTickUpdate(): void
     {
        // eslint-disable-next-line no-useless-return
        if (this.isDisposed) return
        // debug(`number of rides: ${this.featureController.rideController.all.get().length}`)
        // todo is this needed?
     }


     /**
      * Triggers every tick the window UI is updated.
      */
     private onWindowUpdate(): void
     {
        if (this.isDisposed) return;

        // update how many rides are selected
        this.featureController.rideController.setSelectedRidesText()
     }

     private onWindowOpen(): void
     {
        if (this.isDisposed) return;
         debug(`window opened`);
         // moved this line into the settings controller itself. see if this works better.
        //  this.featureController.settingsController.subToSettingsChange()
     }

 }


