type RideColours = [number, number, number, number, number, number];

export interface Theme {
  name: string,
  description: string,
  colours: {
    partColours: {
      trackColourMain?: number[],
      trackColourAdditional?: number[],
      trackColourSupports?: number[],
      VehicleColourBody?: number[],
      VehicleColourTrim?: number[],
      VehicleColourTernary?: number[],
    },
    rideColours?: RideColours[],
  }
  allowDuplicates: boolean,
  settings: string[],
}

const themes:Theme[] = [
  {
    name: 'All Black',
    description: 'All parts of all rides are black.',
    colours: {
      partColours: {
        trackColourMain: [0],
        trackColourAdditional: [0],
        trackColourSupports: [0],
        VehicleColourBody: [0],
        VehicleColourTrim: [0],
        VehicleColourTernary: [0],
      },
      rideColours: [
        [0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1],
      ],
    },
    allowDuplicates: true,
    settings: ['Hi', 'there'],
  },

  {
    name: '10-13',
    description: 'All parts between 10 and 13.',
    colours: {
      partColours: {
        trackColourMain: [5, 14, 20, 30],
        trackColourAdditional: [5, 14, 20, 30],
        trackColourSupports: [5, 14, 20, 30],
        VehicleColourBody: [5, 14, 20, 30],
        VehicleColourTrim: [5, 14, 20, 30],
        VehicleColourTernary: [5, 14, 20, 30],
      },
      rideColours: [
        [10, 10, 10, 10, 10, 10],
        [11, 11, 11, 11, 11, 11],
      ],
    },
    allowDuplicates: true,
    settings: ['Hi', 'there'],
  },
  {
    name: 'Dazzling Colors',
    description: 'Color scheme qualifies park for the "Most Dazzling Ride Colors" award.',
    colours: {
      partColours: {
        trackColourMain: [5, 14, 20, 30],
        trackColourAdditional: [5, 14, 20, 30],
        trackColourSupports: [5, 14, 20, 30],
        VehicleColourBody: [5, 14, 20, 30],
        VehicleColourTrim: [5, 14, 20, 30],
        VehicleColourTernary: [5, 14, 20, 30],
      },
      rideColours: [
        [10, 10, 10, 10, 10, 10],
        // [11, 11, 11, 11, 11, 11],
      ],
    },
    allowDuplicates: true,
    settings: ['Hi', 'there'],
  },
];

export const getThemeNames = ():string[] => {
  const t = [];
  themes.forEach((theme:Theme) => {
    t.push(theme.name);
  });
  return t;
};

export const getThemeByName = (name: string):Theme => {
  const themeAttempt = themes.filter((t:Theme) => t.name === name);
  // TODO: catch if themeAttempt is not found, and return a default theme
  return themeAttempt[0];
};

export default themes;
