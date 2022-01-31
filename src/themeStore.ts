import { store, compute } from 'openrct2-flexui'
import { setConfig, getConfig } from "./helperFunctions"
import { debug } from "./helpers/logger";


const uniqueParkHash = "abc123"

type ThemeState = {
  theme: string
}
const initialThemeState: ThemeState = {
  theme: "none"
}

const initialModeState = {
  modes: {
    twoTone: false,
    monochromatic: false,
    random: false,
    colourByPart: false,
    preselectedParts: false
  }
}

const initialLockedRidesState = {}

const initialParkThemeState = {
  currentTheme: initialThemeState,
  modes: initialModeState,
  lockedRides: initialLockedRidesState,
  uniqueParkHash
}

export const initThemeStore = () => setConfig("themeStore",store(initialThemeState));

export const yodawg = () => {
  const themeStore = store(getConfig("themeStore", false));
  const workingTheme = compute(themeStore, t => t.theme);
  debug(`current theme: ${workingTheme.get()}`);
  themeStore.set({
    theme: "new theme baby."
  });
  debug(`new theme value: ${workingTheme.get()}`);
};

export class ThemeStore {

}
