/* eslint-disable no-use-before-define */
import { debug } from "../helpers/logger";
import { WindowWatcher } from "../window";
import { FeatureController, RideController, SettingsController } from '../controllers/Controllers';

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
         if (this.isDisposed)
             return;

         const action = event.action as ActionType;
         switch (action)
         {
             case "ridecreate":
             case "ridedemolish":
             case "ridesetname":
             {
                // updateRideStore();
                // todo is there more to do here?

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
         if (this.isDisposed)
             return;

        // todo is this needed?
     }


     /**
      * Triggers every tick the window UI is updated.
      */
     private onWindowUpdate(): void
     {
        if (this.isDisposed) return;

        // update how many rides are selected
        setSelectedRidesText(this.featureController.rideController);
     }

     private onWindowOpen(): void
     {
        if (this.isDisposed) return;
         debug(`window opened`);
         subToSettingsChange(this.featureController.settingsController)
     }

 }

const setSelectedRidesText = (rc: RideController) =>
{
 // Page picker text output
 const selectedRides = rc.selectedRides.get() || []
 // set the text for number of rides selectedß
 rc.selectedText.set(`{BLACK}${selectedRides.length}/${rc.all.get().length} rides selected`)
}

const subToSettingsChange =(sc: SettingsController) =>
{
    debug(`subbing to settings changes`)
    sc.automaticPaintFrequency.subscribe((freq) =>
    {
        debug(`sharedStoreage, ${sc.lookupKeys.automaticPaintFrequency}: ${freq}`)
        sc.setAutomaticPaintFrequency(freq)
    });
    sc.paintBrantNewRides.subscribe((toggle) =>
    {
        debug(`sharedStoreage, ${sc.lookupKeys.paintBrantNewRides}: ${toggle}`)
        sc.setPaintBrandNewRides(toggle);
    });
    sc.repaintExistingRides.subscribe((toggle) =>
    {
        debug(`sharedStoreage, ${sc.lookupKeys.repaintExistingRides}: ${toggle}`)
        sc.setRepaintExistingRides(toggle);
    })
}

