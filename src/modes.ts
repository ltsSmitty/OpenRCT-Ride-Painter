/* eslint-disable consistent-return */
import { debug } from "./helpers/logger";
import { Theme, RideColours } from "./themes";

const getRandomColour = (colours: number[]) => colours[Math.floor(Math.random()*colours.length)]


export type ModeObject =
  "ColourByPartMode" | "MonochromaticMode" |"MakeTwoTone" |
  "ChoosePreferredRideColoursMode" | "RandomMode"

//   type ModeOptions = {
//   [key in Mode]: boolean
// }

// export const modeOptions: ModeOptions = {
//   ColourByPartMode: false,
//   MonochromaticMode: false,
//   MakeTwoTone: false,
//   ChoosePreferredRideColoursMode: false,
//   RandomMode: false
// }

export interface Mode {
  readonly name: string,
  applyTheme(theme:Theme): RideColours | null
}

const monoChromaticMode: Mode = {
  name: "monochromatic",
  applyTheme(theme: Theme) {
    if (theme.colours.themeColours) {
    const c = getRandomColour(theme.colours.themeColours);
    return [c,c,c,c,c,c] as RideColours;
    }
    return null;
  }
}

const randomMode: Mode = {
  name: "random",
  applyTheme(theme: Theme) {
    if (theme.colours.themeColours) {
      const colours = [
        getRandomColour(theme.colours.themeColours),
        getRandomColour(theme.colours.themeColours),
        getRandomColour(theme.colours.themeColours),
        getRandomColour(theme.colours.themeColours),
        getRandomColour(theme.colours.themeColours),
        getRandomColour(theme.colours.themeColours)];
        debug(`debug RandomMode: ${colours}`)
        return colours as RideColours
        }
    return null;
  }
}

export const Modes: Mode[] = [
  monoChromaticMode,
  randomMode
]

const doAllPartsHaveColours = (parts: {[keys: string]: Number[]}) => {
  let existingParts = 0;
  Object.keys(parts).forEach((key) => {
    if (parts[key].length>0) existingParts+=1;
  });
  // console.log(`Existing parts: ${existingParts}, total parts: ${Object.keys(parts).length}`);
  return (existingParts === Object.keys(parts).length)
}

const  makeColourByPartMode = (theme: Theme) => {
  // Get ride parts from theme
  debug(`in makeColourByPartMode`)
  const parts = theme.colours.partColours;
  if (parts){
    // Check if there is at least one color given for each track piece
    const c = doAllPartsHaveColours(parts);
    if (c) {
      const colours = [
        getRandomColour(parts.VehicleColourBody),
        getRandomColour(parts.VehicleColourTernary),
        getRandomColour(parts.VehicleColourTrim),
        getRandomColour(parts.trackColourAdditional),
        getRandomColour(parts.trackColourMain),
        getRandomColour(parts.trackColourSupports)
      ]
    debug(`Returning ${colours}`);
    return colours}
  }
}

const makeMonochromaticMode = (theme: Theme) => {
  if (theme.colours.themeColours) {
  const c = getRandomColour(theme.colours.themeColours);
  return [c,c,c,c,c,c];
  }
}

const makeRandomMode = (theme:Theme) => {
  if (theme.colours.themeColours) {
    const colours = [
      getRandomColour(theme.colours.themeColours),
      getRandomColour(theme.colours.themeColours),
      getRandomColour(theme.colours.themeColours),
      getRandomColour(theme.colours.themeColours),
      getRandomColour(theme.colours.themeColours),
      getRandomColour(theme.colours.themeColours)];
      debug(`debug RandomMode: ${colours}`)
      return colours
}}

const makeTwoTone = (theme:Theme) => {
  // Uses two colors for whole ride. trackMain, trackSupports, carAdditional, and carTertiary all match
  // and then trackAdditional and carMain match
  debug(`in makeTwoTone.`)
  if (theme.colours.themeColours && theme.colours.themeColours.length > 1) {
    const c1 = getRandomColour(theme.colours.themeColours);
    let c2;
    do {
      c2 = getRandomColour(theme.colours.themeColours);
    } while (c1 === c2)
    debug(`The two chosen colours are ${c1} and ${c2}`);
    debug(`Returning ${[c1,c2,c1,c2,c1,c1]}`)
    return [c1,c2,c1,c2,c1,c1];
  }
}

const makeChoosePreferredRideColoursMode = (theme: Theme) => {
  debug(`in makeChoosePreferredRideColoursMode`);
  if (theme.colours.preferredRideColours) {
    const colours = [...theme.colours.preferredRideColours
      [Math.floor(Math.random()*theme.colours.preferredRideColours.length)]]
    debug(`Returning: ${colours}`)
    return colours
  }
}

// export const ModeFunctions = (mode:Mode) => {
//   switch (mode) {
//     case "ColourByPartMode": return makeColourByPartMode;
//     case "MonochromaticMode": return makeMonochromaticMode;
//     case "MakeTwoTone": return makeTwoTone;
//     case "ChoosePreferredRideColoursMode": return makeChoosePreferredRideColoursMode;
//     case "RandomMode": return makeRandomMode
//     default: return makeMonochromaticMode
//   }
// }

// TODO make this actually pick from an array of modes
export const pickFrom = (modes: Mode[]) => modes[0]
