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

export type RideColours = [number, number, number, number, number, number];

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
  };
  allowDuplicates: boolean,
}


const allBlack: Theme = {
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
}

const tenThirteen: Theme =  {
  name: '10-13',
  description: 'All parts between 10 and 13.',
  colours: {
    themeColours: [10, 11, 12, 13]
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

const pdogSpecial: Theme = {
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
};

const allColoursBaby: Theme = {
  name: 'All Colors Baby',
  description: `Useful for monochrome mode since it'll pull from the whole palate`,
  colours: {
    themeColours:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
  },
  allowDuplicates: false,
}


export const themes: Theme[] = [
  allBlack,
  tenThirteen,
  dazzlingColors,
  pdogSpecial,
  allColoursBaby
]

