/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */

import { box, button, dropdown,  label, store, toggle, vertical, window } from "openrct2-flexui";
import { themes, Mode, ModeToggle, ModeFunctions, getThemeByName} from './themes';
import ColourChange from './ColourChange';
import {getConfig, setConfig} from './helperFunctions';
import { debug } from "./helpers/logger";

/// <reference path="../lib/openrct2.d.ts" />

const namespace = 'random_ride_colours';
const themeKey = `${namespace}.themeName`;
const modeKey = `${namespace}.mode`

const toggleMode = (modeValue: Mode, t: boolean) => {
  const activeModes: ModeToggle | false = getConfig(modeKey, false);
  if (!activeModes) {
    debug(`not sure if it ever gets here.`);
    setConfig(modeKey,{modeValue:{active:t}});
    return t;
  }
   if (modeValue in activeModes) {
    activeModes[modeValue].active = t
  }
  else {
    activeModes[modeValue] = {active:t}
  }
  setConfig(modeKey,activeModes);
  return activeModes[`${modeValue}`].active

}

const filterActiveModes = (modes: ModeToggle) => {
  debug(`Debug: current mode status: ${JSON.stringify(modes)} `)
  const modeKeys = Object.keys(modes);
  const activeValues: Mode[] = [];
  modeKeys.forEach((key) => {
    if (modes[key as Mode].active === true) activeValues.push(key as Mode)
  })
  return activeValues;
}
const changeRideColoursNow = (rides?:Ride[], exclusions: Ride[]=[]) => {
  const themeName: string = getConfig(themeKey, "All Colors Baby");
  const themeValues = getThemeByName(themeName);
  const modes: ModeToggle = getConfig(modeKey, false)// colourModes.LightAndDarkMode)
  const ridesToTheme = map.rides.filter((ride) => ride.classification === "ride" );
  // TODO handle if an exclusion list is provided
  // remove any exclusions from the ride list
  // if (exclusions.length>0){ridesToTheme = rides.filter(ride => !exclusions.includes(ride));}

  // Filter the theme modes to return the ones which are currently active
  const activeModes=filterActiveModes(modes);

  // loop through remaining rides and choose a mode to colour them with
  ridesToTheme.forEach((ride) => {
    debug(`Ride to set colour: ${ride.name}`);

    const colours = ModeFunctions(activeModes[Math.floor(Math.random()*activeModes.length)])(themeValues)
    // const colourFunction = ModeFunctions(activeModes[Math.floor(Math.random()*activeModes.length)])
    // debug(`colourFunction: ${JSON.stringify(colourFunction)}`);
    // const colours = colourFunction(themes.themeName);
    // set the ride colours
    if (colours)  ColourChange.setRideColour(ride, ...colours);
  })
}

const getThemeIndex = () => {
  const themeName: string = getConfig(themeKey, "All Colors Baby");
  const index = Object.keys(themes).indexOf(themeName)
  debug(`theme index: ${index}`);
  return index;
}

const getToggled = (mode:string) => {
  const activeModes = getConfig(modeKey, false);
  if (activeModes && activeModes[mode]) {
    return activeModes[mode].active;
  }
  return false;
}

const setThemeKey = (themeName: string) => {
  setConfig(themeKey,themeName )
}



const rideDayHook = () => {
  // Get ride colors from a theme
  // const currentTheme: Theme = getThemeByName('All Colors Baby');

  // if (getConfig(changeRideColourKey, false)) {
  //   getRides().forEach((ride:Ride) => {
  //     // const colorByPart = ColourByPartMode(currentTheme);
  //     //const mode = getConfig(modeNameKey,)
  //     //const mono = MonochromaticMode(currentTheme);
  //     if (mono) {
  //       ColourChange.setRideColour(ride, ...mono);
  //     }
  //     // ColourChange.setRandomVehicleColour(ride);
  //   });
  // }

  // chooseRideColorsFromTheme(currentTheme);
};


const existingThemes = Object.keys(themes);

const themeChooser = window({
  title: "Theme Colour Manager",
	width: 200, minWidth: 75, maxWidth: 10000,
	height: 300, minHeight: 75, maxHeight: 10000,
	padding: 5,
  content: [
    box({
      text: 'Current Theme',
      content:
        vertical([
          dropdown({
            // selectedIndex: getThemeIndex(),
            items: [...existingThemes],
            onChange: (index:number) => setThemeKey(existingThemes[index])
      }),
      label({
        text: "__ Colour pickers __",
      }),
    ])
    }),
    vertical([
    box({
      padding: {top: 10},
      text: 'Choose colour modes.',
      content:
        vertical([
          toggle({
            text: "Colour by part",
            height: "28px",
            isPressed: getToggled('ColourByPartMode'),
            onChange: (isPressed: boolean) => toggleMode(Mode.ColourByPartMode,isPressed),
          }),
          toggle({
            text: "Monochromatic",
            height: "28px",
            isPressed: getToggled('MonochromaticMode'),
            onChange: (isPressed: boolean) => toggleMode( Mode.MonochromaticMode,isPressed)
          }),
          toggle(
            {
                        
            text: "Two-tone",
            height: "28px",
            isPressed: getToggled('MakeTwoTone'),
            onChange: (isPressed: boolean) => toggleMode(Mode.MakeTwoTone,isPressed)
          }),
          toggle({
            text: "Preferred Colours",
            height: "28px",
            isPressed: getToggled('ChoosePreferredRideColoursMode'),
            tooltip: "Apply pre-selected favorites",
            onChange: (isPressed: boolean) => toggleMode(Mode.ChoosePreferredRideColoursMode,isPressed),
          }),
          toggle({
            text: "All Parts Random",
            height: "28px",
            isPressed: getToggled('RandomMode'),
            tooltip: "Randomize all pieces",
            onChange: (isPressed: boolean) => toggleMode(Mode.RandomMode,isPressed),
          }),
        ])}),
    button({
      padding: {top: 10},
      text: "Change all ride colours now",
      height: "30px",
      onClick: () => changeRideColoursNow()
    })])
  ]
})

// // Configuration window
// const showWindow = () => {
//   const window = ui.getWindow(namespace);
//   if (window) {
//     window.bringToFront();
//     return;
//   }

//   ui.openWindow({
//     classification: namespace,
//     width: 240,
//     height: 102,
//     title: 'Random Ride Colours',
//     widgets: [
//       {
//         type: 'checkbox',
//         x: 5,
//         y: 20,
//         width: 210,
//         height: 10,
//         tooltip: '',
//         text: 'Change Ride Colour daily',
//         isChecked: helpers.getConfig(changeRideColourKey, false),
//         onChange: (params) => {
//           helpers.setConfig(changeRideColourKey, params);
//         },
//       },
//     ],
//   });
// };

// // Main function registering menu and hook.
// export default function changeRideColors() {
//   ui.registerMenuItem('Random Ride Colours', () => {
//     showWindow();
//   });
//   context.subscribe('interval.day', rideDayHook);
// }


export default themeChooser;
