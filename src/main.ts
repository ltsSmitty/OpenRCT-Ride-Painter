import { themeWindow, dailyUpdate } from "./window";
import StateWatcher from "./services/stateWatcher";
import { model, IModel } from "./model";
import { debug } from "./helpers/logger";

// plugin constants
// const namespace = `ride-painter`
// const storageKey = `${namespace}-`

const initializeModel = () =>
{
    // Initialize model for plugin.
    // First check if the parkStorage has an existing model
    // If not, check for settings from sharedStorage
    // Then use those settings or defaults to initialize the model.
    const modelFromParkStorage = context.getParkStorage().get("model") as typeof model ;

    if (modelFromParkStorage)
    {
        // set the active model to be this model
        debug(`model found in parkStorage`)
        for (const k in model)
        {
            if ({}.hasOwnProperty.call(model, k))
            {
                model[k] = modelFromParkStorage[k as keyof IModel];
                // todo does this actually work?
                // todo the error is wrong but i don't know how to fix it.
            }
        }
    }
    else
    {
        // check if there's default plugin information in
        // todo make the key actually work
        const defaultsInGlobalStorage = context.sharedStorage.get(`thisKey`) as IModel[`settings`] | undefined
        if (defaultsInGlobalStorage)
        {
            // defaults found in sharedStorage
            debug(`defaults found in sharedStorage`)
            model.settings = defaultsInGlobalStorage
        }
        else
        {
            // no defaults found, initialize plugin with default values
            debug(`no model or defaults found. using plugin default settings`)
        }
        //
    }
}

const main = () =>
{
    initializeModel();
    const watcher = new StateWatcher();
    ui.registerMenuItem("Ride Painter", () => themeWindow.open())
    context.subscribe('interval.day', () =>
{
        dailyUpdate();
    });
    // initPluginSettings();
    dailyUpdate();

    //
}

export default main
