/* eslint-disable consistent-return */
import { debug } from "./helpers/logger";
import { Theme, RideColours } from "./themes";

const getRandomColour = (colours: number[]) => colours[Math.floor(Math.random()*colours.length)]

const doAllPartsHaveColours = (parts: {[keys: string]: Number[]}) => {
  let existingParts = 0;
  Object.keys(parts).forEach((key) => {
    if (parts[key].length>0) existingParts+=1;
  });
  return (existingParts === Object.keys(parts).length)
}


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

const twoToneMode: Mode = {
  name: "twoTone",
  applyTheme(theme: Theme) {
    if (theme.colours.themeColours && theme.colours.themeColours.length > 1) {
      const c1 = 0
      let c2;
      do {
        c2 = getRandomColour(theme.colours.themeColours);
      } while (c1 === c2)
      debug(`The two chosen colours are ${c1} and ${c2}`);
      debug(`Returning ${[c1,c2,c1,c2,c1,c1]}`)
      return [c1,c2,c1,c2,c1,c1] as RideColours
    }
    return null
  }
}

const  colourByPartMode: Mode = {
  name: 'colourByPart',
  applyTheme(theme: Theme) {
    // Get ride parts from theme
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
      return colours as RideColours}
    }
    return null;
  }
}

const prebuiltColoursMode: Mode = {
  name: "prebuildColours",
  applyTheme(theme: Theme) {
    if (theme.colours.preferredRideColours) {
      const colours = [...theme.colours.preferredRideColours
        [Math.floor(Math.random()*theme.colours.preferredRideColours.length)]]
      return colours as RideColours
    }
    return null;
  }
}


export const Modes: Mode[] = [
  monoChromaticMode,
  randomMode,
  twoToneMode,
  colourByPartMode,
  prebuiltColoursMode
]

// TODO make this actually pick from an array of modes
export const pickFrom = (modes: Mode[]) => modes[0]
