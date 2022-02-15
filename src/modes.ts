/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import { Colour } from 'openrct2-flexui';
import { debug } from './helpers/logger';
import { Theme, RideColours } from './themes';


const getRandomColour = (colours: number[]) => colours[Math.floor(Math.random() * colours.length)];

export interface Mode {
	readonly name: string;
	description: string;
	applyTheme(theme: Theme, options: { [key: string]: any }): RideColours | null;
}

const monoChromaticMode: Mode = {
	name: 'Monochromatic ride & track',
	description: 'Paint the ride & cars in one solid colour.',
	applyTheme(theme: Theme) {
		if (theme.colours.themeColours) {
			const c = getRandomColour(theme.colours.themeColours);
			return [c, c, c, c, c, c] as RideColours;
		}
		return null;
	},
};

const randomMode: Mode = {
	name: 'Random colours',
	description: 'Paint each track and car piece in random colours from the theme palette.',
	applyTheme(theme: Theme) {
		if (theme.colours.themeColours) {
			const colours = [
				getRandomColour(theme.colours.themeColours),
				getRandomColour(theme.colours.themeColours),
				getRandomColour(theme.colours.themeColours),
				getRandomColour(theme.colours.themeColours),
				getRandomColour(theme.colours.themeColours),
				getRandomColour(theme.colours.themeColours),
			];

			return colours as RideColours;
		}
		return null;
	},
};

const customPatternMode: Mode = {
	name: 'Custom pattern',
	description: `Paint the enabled ride parts with your chosen colour; otherwise fill from palette.`,
	applyTheme(theme: Theme, options:{customColours:Colour[]} ) {
		if (theme.colours.themeColours) {
            // choose a random base colour from the theme
			const col = getRandomColour(theme.colours.themeColours);
            // loop through the given customColours
            // any that were active will paint that piece
            // otherwise it'll paint the base colour
            const ret = [-1,-1,-1,-1,-1,-1];
            for (let i = 0; i<6;i+=1){
                ret[i]=(options.customColours[i]>=0 ? options.customColours[i] : col)
            }
            debug(`custom colour to paint: ${ret}`)
			return ret as RideColours;
		}
		return null;
	},
};

const buildOrderMode: Mode = {
	name: 'Build order',
	description: `Paint rides in the order they were built. Goes especially well with the 'Rainbow' theme and selecting a ride type you have multiple of.`,
	applyTheme(theme: Theme, { index }) {
		if (theme.colours.partColours) {
			const ret = [
				theme.colours.partColours.trackColourMain[index % theme.colours.partColours.trackColourMain.length],
				theme.colours.partColours.trackColourAdditional[
					index % theme.colours.partColours.trackColourAdditional.length
				],
				theme.colours.partColours.trackColourSupports[
					index % theme.colours.partColours.trackColourSupports.length
				],
				theme.colours.partColours.VehicleColourBody[index % theme.colours.partColours.VehicleColourBody.length],
				theme.colours.partColours.VehicleColourTrim[index % theme.colours.partColours.VehicleColourTrim.length],
				theme.colours.partColours.VehicleColourTernary[
					index % theme.colours.partColours.VehicleColourTernary.length
				],
			];
			return ret as RideColours;
		}
        if (theme.colours.themeColours) {
            const c = theme.colours.themeColours[index%theme.colours.themeColours.length];
            return [c, c, c, c, c, c] as RideColours
        }
		return null;
	},
};

// const colourByPartMode: Mode = {
// 	name: 'colourByPart',
// 	description: '',
// 	applyTheme(theme: Theme) {
// 		// Get ride parts from theme
// 		const parts = theme.colours.partColours;
// 		if (parts) {
// 			// Check if there is at least one color given for each track piece
// 			const c = doAllPartsHaveColours(parts);
// 			if (c) {
// 				const colours = [
// 					getRandomColour(parts.VehicleColourBody),
// 					getRandomColour(parts.VehicleColourTernary),
// 					getRandomColour(parts.VehicleColourTrim),
// 					getRandomColour(parts.trackColourAdditional),
// 					getRandomColour(parts.trackColourMain),
// 					getRandomColour(parts.trackColourSupports),
// 				];
// 				return colours as RideColours;
// 			}
// 		}
// 		return null;
// 	},
// };

// const prebuiltColoursMode: Mode = {
// 	name: 'prebuildColours',
// 	description: '',
// 	applyTheme(theme: Theme) {
// 		if (theme.colours.preferredRideColours) {
// 			const colours = [
// 				...theme.colours.preferredRideColours[
// 					Math.floor(Math.random() * theme.colours.preferredRideColours.length)
// 				],
// 			];
// 			return colours as RideColours;
// 		}
// 		return null;
// 	},
// };

export const Modes: Mode[] = [
	monoChromaticMode,
	randomMode,
	buildOrderMode,
	customPatternMode,
];
