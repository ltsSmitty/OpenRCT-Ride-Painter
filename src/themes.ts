/* eslint-disable consistent-return */

import { debug } from "./helpers/logger";

/* eslint-disable no-console */
export const enum GameColour
{
	Black,          // 0
	Grey,           // 1
	White,          // 2
  DarkPurple,     // 3
	LightPurple,    // 4
	BrightPurple,   // 5
	DarkBlue,       // 6
	LightBlue,      // 7
	IcyBlue,        // 8
	Teal,           // 9
	Aquamarine,     // 10
	SaturatedGreen, // 11
	DarkGreen,      // 12
	MossGreen,      // 13
	BrightGreen,    // 14
	OliveGreen,     // 15
	DarkOliveGreen, // 16
	BrightYellow,   // 17
	Yellow,         // 18
	DarkYellow,     // 19
	LightOrange,    // 20
	DarkOrange,     // 21
	LightBrown,     // 22
	SaturatedBrown, // 23
	DarkBrown,      // 24
SalmonPink,       // 25
	BordeauxRed,    // 26
	SaturatedRed,   // 27
	BrightRed,      // 28
	DarkPink,       // 29
	BrightPink,     // 30
	LightPink,      // 31
}

type RideColours = [number, number, number, number, number, number];

export interface Theme {
  name: string,
  description: string,
  colours: {
    // The palette of colours you'd like available.
    // e.g. [2, 5, 9, 12, 13, 14, 30]
    themeColours: number[],
    // Preselected RideColour combinations that you know look good. Can include colors different from themeColours above
    // e.g. [[1, 2, 3, 4, 5, 6], [5, 20, 5, 20, 4, 1]]
    preferredRideColours?: RideColours[],
    // If you know you want certain parts of the ride to have certain colors, you can define them here.
    // If you go this route, you need to offer at least one colour option for each track park
    partColours?: {
      trackColourMain: number[],
      trackColourAdditional: number[],
      trackColourSupports: number[],
      VehicleColourBody: number[],
      VehicleColourTrim: number[],
      VehicleColourTernary: number[],
    },
  }
  allowDuplicates: boolean,
}

export const themes:{[key: string]:Theme} = {
  "allBlack":  {
    name: 'All Black',
    description: 'All parts of all rides are black.',
    colours: {
      themeColours: [0],
      partColours: {
        trackColourMain: [0],
        trackColourAdditional: [0],
        trackColourSupports: [0],
        VehicleColourBody: [0],
        VehicleColourTrim: [0],
        VehicleColourTernary: [0],
      }
    },
    allowDuplicates: true,
  },
  "1013":  {
    name: '10-13',
    description: 'All parts between 10 and 13.',
    colours: {
      themeColours: [10, 11, 12, 13]
    },
    allowDuplicates: true,
  },
  "Dazzling Colors":  {
    name: 'Dazzling Colors',
    description: 'Color scheme qualifies park for the "Most Dazzling Ride Colors" award.',
    colours: {
      themeColours: [5, 14, 20, 30],
      partColours: {
        trackColourMain: [5, 14, 20, 30],
        trackColourAdditional: [5, 14, 20, 30],
        trackColourSupports: [5, 14, 20, 30],
        VehicleColourBody: [5, 14, 20, 30],
        VehicleColourTrim: [5, 14, 20, 30],
        VehicleColourTernary: [5, 14, 20, 30],
      },
      preferredRideColours: [
        [5, 30, 5, 30, 5, 5],
        [14, 14, 20, 20, 20, 20]
      ],
    },
    allowDuplicates: true,
  },
  "Pdog Special":  {
    name: 'Pdog Special',
    description: 'One that I like',
    colours: {
      themeColours: [29,30,31],
      partColours: {
        trackColourMain: [1, 2, 3, 4],
        trackColourAdditional: [5, 6, 7, 8],
        trackColourSupports: [9, 10, 11, 12],
        VehicleColourBody: [13, 14, 15, 16],
        VehicleColourTrim: [17, 18, 19, 20],
        VehicleColourTernary: [21, 22, 23, 23],
      },
    },
    allowDuplicates: false,
  },
  "All Colors Baby": {
    name: 'All Colors Baby',
    description: `Useful for monochrome mode since it'll pull from the whole palate`,
    colours: {
      themeColours:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
    },
    allowDuplicates: false,
  }
};

export const enum Mode {
  ColourByPartMode = "ColourByPartMode",
  MonochromaticMode = "MonochromaticMode",
  MakeTwoTone = "MakeTwoTone",
  ChoosePreferredRideColoursMode = "ChoosePreferredRideColoursMode",
  RandomMode = "RandomMode"
}

export type ModeToggle = {
  [k in Mode]: {
    active: boolean
  }
}



const doAllPartsHaveColours = (parts: {[keys: string]: Number[]}) => {
  let existingParts = 0;
  Object.keys(parts).forEach((key) => {
    if (parts[key].length>0) existingParts+=1;
  });
  // console.log(`Existing parts: ${existingParts}, total parts: ${Object.keys(parts).length}`);
  return (existingParts === Object.keys(parts).length)
}

const getRandomColour = (colours: number[]) => colours[Math.floor(Math.random()*colours.length)]


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

export const getThemeNames = ():string[] =>  Object.keys(themes);

export const getThemeByName = (name: string):Theme => {
  const themeAttempt = Object.keys(themes).filter((k) => k===name)
  if (themeAttempt[0]) return themes[themeAttempt[0]]
  console.log(`Setting theme to: ${themes[themeAttempt[0]]}`);
  return themes.allBlack
};

export const ModeFunctions = (mode:Mode) => {
  switch (mode) {
    case "ColourByPartMode": return makeColourByPartMode;
    case "MonochromaticMode": return makeMonochromaticMode;
    case "MakeTwoTone": return makeTwoTone;
    case "ChoosePreferredRideColoursMode": return makeChoosePreferredRideColoursMode;
    case "RandomMode": return makeRandomMode
    default: return makeMonochromaticMode
  }
}
