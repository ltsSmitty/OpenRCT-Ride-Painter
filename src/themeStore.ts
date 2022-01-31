import { themes, Theme } from './themes';
import store

const uniqueParkHash = "abc123";

interface ThemeState {
  theme: string | undefined
}

const initialThemeState: ThemeState = {
  theme: undefined
}

interface ModeState {
  modes: {
    [mode:string] : boolean
  }
}

const initialModeState: ModeState = {
  modes: {
    twoTone: false,
    monochromatic: false,
    random: false,
    colourByPart: false,
    preselectedParts: false
  }
}

interface LockedRides {
  [rideId:string] : boolean
}

const initialLockedRidesState: LockedRides = {};

interface ParkThemeState {
  currentTheme: ThemeState,
  modes: ModeState
  lockedRides: LockedRides,
  uniqueParkHash: string
}

const initialParkThemeState: ParkThemeState = {
  currentTheme: initialThemeState,
  modes: initialModeState,
  lockedRides: initialLockedRidesState,
  uniqueParkHash
}

function updateTheme(state = initialState, action: {type: string}) {
  return {...state, theme: state.theme}
}

const parkThemeStore = store()
