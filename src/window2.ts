/// <reference path="../lib/openrct2.d.ts" />

import { box, button, compute, dropdownSpinner, horizontal, label, store,
  toggle, viewport, window } from "openrct2-flexui";
import { Mode, Modes, ModeObject, pickFrom } from "./modes";
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
const toggleModeActive = (modeName: string, isPressed: boolean) => {
  const allModes = model.allModes.get();
  debug(`allModes: ${JSON.stringify(allModes)}`)
  const thisMode = allModes.filter(mode => mode.name === modeName)[0]
  debug(`in toggleModeActive. looking for ${modeName}. found: ${JSON.stringify(thisMode)}`)
  // the mode exists
  if (thisMode){
    const activeModes = model.activeModes.get();
    const thisModeIndex =  activeModes.indexOf(thisMode);
    debug(`thisModeIndex = ${thisModeIndex}`);
    // if the mode is active the indexOf will be >=0. If it's not in it it'll be -1.
    if (thisModeIndex>=0)  activeModes.splice(thisModeIndex,1)
    else activeModes.push(thisMode);
    debug(`activeModes to be set to model: ${JSON.stringify(activeModes)}`);
    model.activeModes.set(activeModes);
    }
  }


const modeInit = () => {
  const modes:Mode[] = Modes;
  model.allModes.set(modes);
};

const themeInit = () => {
  const startingTheme = themes["All Colors Baby"];
  model.allThemes.set([startingTheme])
  model.selectedTheme.set(startingTheme)
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
    toggle({
      text: 'Toggle monochrome mode',
      onChange: (isPressed: boolean) => {toggleModeActive('monochromatic', isPressed)},
      isPressed: subscribeToggle('monochromatic')
    }),
    toggle({
      text: 'Toggle random mode',
      onChange: (isPressed: boolean) => {toggleModeActive('random', isPressed)},
      isPressed: subscribeToggle('random')
    }),
    button({
      text: 'Set ride colours according to mode',
      // todo disabled: check store if a theme is set
      onClick: () => colourRides()
    })
  ]
})




