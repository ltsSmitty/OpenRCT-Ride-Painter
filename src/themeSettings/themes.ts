/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-unresolved
import { Colour } from 'openrct2-flexui';

export type RideColours = [number, number, number, number, number, number];

export interface Theme {
  name: string,
  description: string,
  colours: {
    // The palette of colours you'd like available.
    // e.g. [2, 5, 9, 12, 13, 14, 30]
    themeColours: number[],
    // !curently unused
    // Preselected RideColour combinations that you know look good. Can include colors different from themeColours above
    // e.g. [[1, 2, 3, 4, 5, 6], [5, 20, 5, 20, 4, 1]]
    preferredRideColours?: RideColours[],
    // If you know you want certain parts of the ride to have certain colors, you can define them here.
    // If you go this route, you need to offer at least one colour option for each track park
    partColours?: {
      trackColourMain: Colour[],
      trackColourAdditional: number[],
      trackColourSupports: number[],
      VehicleColourBody: number[],
      VehicleColourTrim: number[],
      VehicleColourTernary: number[],
    },
  };
  // todo add functionality to ensure no duplicates
  allowDuplicates?: boolean,
}


const justBlack: Theme = {
  name: 'Just Black',
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
}

const forest: Theme =  {
  name: 'Forest',
  description: 'Woodsy colours.',
  colours: {
    themeColours: [ 11, 12, 13, 14, 15, 16, 19, 22, 23]
  },
  allowDuplicates: true,
};

const dazzlingColors: Theme = {
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
};

const rainbow: Theme = {
    name: 'Rainbow',
    description: "Marcel's favorite",
    colours: {
      themeColours: [
        //
        Colour.BrightRed, Colour.LightOrange, Colour.BrightYellow,
        Colour.BrightGreen, Colour.LightBlue, Colour.LightPurple,
        Colour.LightPink,
        Colour.SaturatedRed, Colour.DarkOrange, Colour.Yellow,
        Colour.SaturatedGreen, Colour.DarkBlue, Colour.BrightPurple,
        Colour.BrightPink,
    ],
      partColours: {
        trackColourMain: [
            Colour.BrightRed, Colour.LightOrange, Colour.BrightYellow,
            Colour.BrightGreen, Colour.LightBlue, Colour.LightPurple,
            Colour.LightPink],
        trackColourAdditional: [
            Colour.BrightRed, Colour.LightOrange, Colour.BrightYellow,
            Colour.BrightGreen, Colour.LightBlue, Colour.LightPurple,
            Colour.LightPink],
        trackColourSupports: [
            Colour.BrightRed, Colour.LightOrange, Colour.BrightYellow,
            Colour.BrightGreen, Colour.LightBlue, Colour.LightPurple,
            Colour.LightPink],
        VehicleColourBody: [
            Colour.SaturatedRed, Colour.DarkOrange, Colour.Yellow,
            Colour.SaturatedGreen, Colour.DarkBlue, Colour.BrightPurple,
            Colour.BrightPink
            ],
        VehicleColourTrim: [
            Colour.SaturatedRed, Colour.DarkOrange, Colour.Yellow,
            Colour.SaturatedGreen, Colour.DarkBlue, Colour.BrightPurple,
            Colour.BrightPink
            ],
        VehicleColourTernary: [
            Colour.SaturatedRed, Colour.DarkOrange, Colour.Yellow,
            Colour.SaturatedGreen, Colour.DarkBlue, Colour.BrightPurple,
            Colour.BrightPink
            ],
      },
    },
    allowDuplicates: false,
  };

const valentines: Theme = {
  name: 'Valentines',
  description: 'One that I like',
  colours: {
    themeColours: [25,26,27,28,29,30,31],
  },
  allowDuplicates: false,
};

const allColours: Theme = {
  name: 'All Colors',
  description: `Useful for monochrome mode since it'll pull from the whole palate`,
  colours: {
    themeColours:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
  },
  allowDuplicates: false,
}

const desert: Theme = {
    name: "Desert",
    description: "Browns and tans",
    colours: {
        themeColours: [1, 16, 18, 19, 21, 22, 23, 24, 25]
    }
}

const aqua: Theme = {
    name: "Aqua",
    description: "Blues and Greens",
    colours: {
        themeColours: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16]
    }
}

export const themes: Theme[] = [
    allColours,
    dazzlingColors,
    rainbow,
    forest,
    valentines,
    desert,
    aqua,
    justBlack,
]

