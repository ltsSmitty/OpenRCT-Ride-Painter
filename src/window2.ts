/// <reference path="../lib/openrct2.d.ts" />


// eslint-disable-next-line import/no-extraneous-dependencies
import { box, button, compute, dropdown, horizontal, label, store,
  toggle, window } from "openrct2-flexui";
import { Mode, Modes, pickFrom } from "./modes";
import { Theme, themes } from "./themes";
import { debug } from "./helpers/logger";
import ColourChange from "./ColourChange";

const model = {
  // Theme data
  allThemes: store<Theme[]>([]),
  selectedThemeIndex:store<number>(0),
  selectedTheme: store<Theme | null>(null),
  // Mode data
  allModes: store<Mode[]>([]),
  selectedModeName: store<string>(""),
  activeModes: store<Mode[]>([]),
  // Locked Rides
  allRides: store<Ride[]>([]),
  lockedRides: store<Ride[] | null>(null)
}


// Subscribe a toggle element to it's mode active state, subscribe to whether it's in activeModes
const subscribeToggle = (modeName: string) => compute(model.activeModes, (modes) => {
   if (modes && modes.length>0) {
     const modeNameActive = (modes.some((mode)=> mode.name === modeName))
     debug(`In subscribeToggle. mode name: ${modeName}, active state: ${modeNameActive}`)
     return modeNameActive;
   }
   debug(`In subscribeToggle. mode name: ${modeName}, active state: false`)
   return false
 })


 // check in activeModes for the mode. if it's there, remove it. if it's not there, add it.
const toggleModeActive = (modeName: string) => {
  const allModes = model.allModes.get();
  const thisMode = allModes.filter(mode => mode.name === modeName)[0]
  // the mode exists
  if (thisMode){
    const activeModes = model.activeModes.get();
    const thisModeIndex =  activeModes.indexOf(thisMode);
    // if the mode is active the indexOf will be >=0. If it's not in it it'll be -1.
    if (thisModeIndex>=0)  activeModes.splice(thisModeIndex,1)
    else activeModes.push(thisMode);
    debug(`Toggle complete. current active modes: ${JSON.stringify(activeModes)}`);
    model.activeModes.set(activeModes);
    }
  }


const modeInit = () => {
  const modes:Mode[] = Modes;
  model.allModes.set(modes);
};

const themeInit = () => {
  model.allThemes.set(themes);
  // TODO don't reset this every time?
  model.selectedThemeIndex.set(0);
  model.selectedTheme.set(model.allThemes.get()[model.selectedThemeIndex.get()]);

}

const colourRides = () => {
  const currentTheme = model.selectedTheme.get();
  const activeModes = model.activeModes.get();

  if (currentTheme && activeModes.length>0) {
    // choose one mode to use, or come up with a system for blending them together
    const mode = pickFrom(activeModes);
    // get all rides
    const ridesToTheme = map.rides.filter((ride) => ride.classification === "ride" );
    ridesToTheme.forEach( ride => {
      const cols = mode.applyTheme(currentTheme);
      if (cols) {
        ColourChange.setRideColour(ride, ...cols)
      }
    })
  }
}

// eslint-disable-next-line import/prefer-default-export
export const themeWindow = window({
  title: "ToggleTest",
	width: 350, minWidth: 220, maxWidth: 500,
	height: 300, minHeight: 220, maxHeight: 400,
	padding: 8,
  onOpen: () => {
    modeInit();
    themeInit();
  },
  content: [
    box({
      text: 'Pick a theme',
      content: dropdown({
        items: compute(model.allThemes, (t) => t.map(theme => theme.name)),
        selectedIndex: model.selectedThemeIndex,
        disabled: compute(model.allThemes, t => t.length === 0),
        disabledMessage: 'No themes defined.',
        onChange: (index: number) => {
          model.selectedThemeIndex.set(index)
          model.selectedTheme.set(model.allThemes.get()[index])
        }
      })
    }),
    toggle({
      text: 'Toggle monochrome mode',
      onChange: () => {toggleModeActive('monochromatic')},
      isPressed: subscribeToggle('monochromatic')
    }),
    toggle({
      text: 'Toggle random mode',
      onChange: () => {toggleModeActive('random')},
      isPressed: subscribeToggle('random')
    }),
    button({
      text: 'Set ride colours according to mode',
      disabled: compute(model.activeModes, mode => mode.length<=0),
      onClick: () => colourRides()
    })
  ]
})




