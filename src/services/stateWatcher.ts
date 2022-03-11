/* eslint-disable no-param-reassign */
import { debug } from "../helpers/logger";
import { WindowWatcher, model } from "../window";
/**
 * Watches the state of the game, and updates relevant services if necessary.
 */
 export default class StateWatcher implements IDisposable
 {
     private onActionHook: IDisposable;

     private onUpdateHook: IDisposable;

     private isDisposed: boolean = false;


     constructor(
     )
     {
         debug("(watcher) Watcher initialized");
         this.onActionHook = context.subscribe("action.execute", e => this.onActionExecuted(e));
         this.onUpdateHook = context.subscribe("interval.tick", () => this.onGameTickUpdate());
         WindowWatcher.onWindowUpdate = ():void => this.onWindowUpdate();
         WindowWatcher.onWindowOpen = ():void => this.onWindowOpen();
     }


     dispose(): void
     {
         this.onActionHook.dispose();
         this.onUpdateHook.dispose();
         this.isDisposed = true;
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
                // todo update model.rides.all
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
         debug(`window updated`)

        // todo is this necessary?
     }

     private onWindowOpen(): void
     {
        if (this.isDisposed) return;
         debug(`window opened`);
     }
 }
