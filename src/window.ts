/// <reference path="../lib/openrct2.d.ts" />
import { Theme, getThemeNames, getThemeByName } from './themes';

import ColourChange from './ColourChange';
import { getRides } from './helpers';

const namespace = 'random_ride_colours';
const changeRideColourKey = `${namespace}.changeRideColour`;
const themeEnabledKey = `${namespace}.themeEnabled`;

const themeEnabled = true;

// Retrieve given key from sharedStorage, returns defaultValue if not found.
export const getConfig = (key, defaultValue) => context.sharedStorage.get(key, defaultValue);

// Stores given value under given key in sharedStorage.
export const setConfig = (key, value) => context.sharedStorage.set(key, value);

const chooseRideColorsFromTheme = (theme: Theme):number[] => {
  // it might use one of the given acceptable schemes, or might assign a static option
  const parts = theme.colours.partColours;
  const possibleCombinations = parts.VehicleColourBody.length
    + parts.VehicleColourTernary.length
    + parts.VehicleColourTrim.length
    + parts.trackColourAdditional.length
    + parts.trackColourMain.length
    + parts.trackColourSupports.length;

  const completedCars = theme.colours.rideColours;

  // eslint-disable-next-line no-console
  console.log(`Theme name: ${theme.name}.
  Possible combinations: ${possibleCombinations}.
  Completed cars: ${completedCars.length}`);

  // choose one from each and plop it into an array?
  const finalColours:number[] = [];
  // if it goes the random route
  // main = random choice from main list
  // trim = random choice from trim list, etc
  return finalColours;
};

const setRideColourAccordingToTheme = (ride:Ride) => {
  let newRideColours;
// check that a theme is set
// randomly choose an acceptable 6 colors
// ColourChange.setRideColour(ride,...newRideColours);
};

const rideDayHook = () => {
  console.log(`Getting themes: ${getThemeNames().toString()}`);
  const currentTheme: Theme = getThemeByName('Dazzling Colors');
  chooseRideColorsFromTheme(currentTheme);

  if (getConfig(changeRideColourKey, false)) {
    getRides().forEach((ride:Ride) => {
      ColourChange.setRandomTrackColour(ride);
      // ColourChange.setRandomVehicleColour(ride);
    });
  }
};

// Configuration window
const showWindow = () => {
  const window = ui.getWindow(namespace);
  if (window) {
    window.bringToFront();
    return;
  }

  ui.openWindow({
    classification: namespace,
    width: 240,
    height: 102,
    title: 'Random Ride Colours',
    widgets: [
      {
        type: 'checkbox',
        x: 5,
        y: 20,
        width: 210,
        height: 10,
        tooltip: '',
        text: 'Change Ride Colour daily',
        isChecked: getConfig(changeRideColourKey, false),
        onChange: (params) => {
          setConfig(changeRideColourKey, params);
        },
      },
      // {
      //   type: 'button',
      //   x: 5,
      //   y: 35,
      //   width: 230,
      //   height: 21,
      //   text: "Change Stall Balloon Colour once",
      //   tooltip: "",
      //   isPressed: false,
      //   onClick: changeStallBalloonColour,
      // },
      // {
      //   type: 'checkbox',
      //   x: 5,
      //   y: 61,
      //   width: 210,
      //   height: 10,
      //   tooltip: "",
      //   text: "Change Peep Balloon Colour daily",
      //   isChecked: getConfig(changePeepBalloonColourKey, false),
      //   onChange: function (params) { setConfig(changePeepBalloonColourKey, params);}
      // },
      // {
      //   type: 'button',
      //   x: 5,
      //   y: 76,
      //   width: 230,
      //   height: 21,
      //   text: "Change Peep Balloon Colour once",
      //   tooltip: "",
      //   isPressed: false,
      //   onClick: changePeepBalloonColour,
      // }
    ],
  });
};

// Main function registering menu and hook.
export default function changeRideColors() {
  ui.registerMenuItem('Random Ride Colours', () => {
    showWindow();
  });
  context.subscribe('interval.day', rideDayHook);
}
