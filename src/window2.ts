
/// <reference path="../lib/openrct2.d.ts" />

// eslint-disable-next-line import/no-extraneous-dependencies
import { box, button, compute, colourPicker ,dropdown, horizontal, label,
    store, window, vertical, toggle, Colour } from 'openrct2-flexui';
import { Mode, Modes } from './modes';
import { Theme, themes } from './themes';
import { debug } from './helpers/logger';
import ColourChange from './ColourChange';
import { getRides } from './helperFunctions';
import { RideType } from './RideType';

export const model = {
	// Theme data
	allThemes: store<Theme[]>([]),
	selectedThemeIndex: store<number>(0),
	selectedTheme: store<Theme | null>(null),
	// Mode data
	allModes: store<Mode[]>([]),
	selectedModeIndex: store<number>(0),
	selectedMode: store<Mode | null>(null),
        // twoTone mode data
        selectedTwoToneBase: store<Colour | null>(0),
	// Locked Rides
	allRides: store<Ride[]>([]),
    selectedRideTypes: store<number[]>([]),
	lockedRides: store<Ride[] | null>(null),
};

const subscribeColourPicker = (colourToggleIndex: Colour) => compute(model.selectedTheme, theme => {
        if (theme?.colours.themeColours[colourToggleIndex]) {
            return theme.colours.themeColours[colourToggleIndex] as Colour
        }
        return 0 as Colour
    })

const subscribeColourPickerActive = (colourToggleIndex: Colour) => compute(model.selectedTheme, theme => {
    if (theme?.colours.themeColours.length &&  theme.colours.themeColours.length > colourToggleIndex) return "visible"
    return "none"
})

// Subscribe a toggle element to it's mode active state, subscribe to whether it's in activeModes
// const subscribeToggle = (modeName: string) =>
// 	compute(model.activeModes, (modes) => {
// 		if (modes && modes.length > 0) {
// 			const modeNameActive = modes.some((mode) => mode.name === modeName);
// 			debug(`In subscribeToggle. mode name: ${modeName}, active state: ${modeNameActive}`);
// 			return modeNameActive;
// 		}
// 		debug(`In subscribeToggle. mode name: ${modeName}, active state: false`);
// 		return false;
// 	});

// check in activeModes for the mode. if it's there, remove it. if it's not there, add it.
// const toggleModeActive = (modeName: string) => {
// 	const allModes = model.allModes.get();
// 	const thisMode = allModes.filter((mode) => mode.name === modeName)[0];
// 	// the mode exists
// 	if (thisMode) {
// 		const activeModes = model.selectedMode.get();
// 		const thisModeIndex = activeModes.indexOf(thisMode);
// 		// if the mode is active the indexOf will be >=0. If it's not in it it'll be -1.
// 		if (thisModeIndex >= 0) activeModes.splice(thisModeIndex, 1);
// 		else activeModes.push(thisMode);
// 		debug(`Toggle complete. current active modes: ${JSON.stringify(activeModes)}`);
// 		model.activeModes.set(activeModes);
// 	}
// };

const modeInit = () => {
	const modes: Mode[] = Modes;
	model.allModes.set(modes);
    model.selectedModeIndex.set(0);
    model.selectedMode.set(model.allModes.get()[model.selectedModeIndex.get()]);
};

const themeInit = () => {
	model.allThemes.set(themes);
	// TODO don't reset this every time?
	model.selectedThemeIndex.set(4);
	model.selectedTheme.set(model.allThemes.get()[model.selectedThemeIndex.get()]);
};

const colourRides = () => {
	const currentTheme = model.selectedTheme.get();
	const currentMode = model.selectedMode.get();

	if (currentTheme && currentMode) {
		// get all rides
		const ridesToTheme = map.rides.filter((ride) => ride.classification === 'ride');
		ridesToTheme.forEach((ride, i) => {
			const cols = currentMode.applyTheme(currentTheme,
                {baseColour:model.selectedTwoToneBase.get(),
                index: i});
			if (cols) {
				ColourChange.setRideColour(ride, ...cols);
			}
		});
	}
};

// eslint-disable-next-line import/prefer-default-export
export const themeWindow = window({
	title: 'ToggleTest',
	width: 700,
    minWidth: 280,
    maxWidth: 700,
	height: 300,
	minHeight: 220,
	maxHeight: 400,
	padding: 8,
	onOpen: () => {
		modeInit();
		themeInit();
	},
    spacing: 20,
	content: [
        horizontal({
            width: '280px',
                content: [
                    vertical([
                        box({
                            text: 'Pick a theme',
                            content:
                                vertical({
                                    padding: 10,
                                    spacing: 5,
                                    content: [
                                        dropdown({
                                            height: '20px',
                                            items: compute(model.allThemes, (t) => t.map((theme) => theme.name)),
                                            selectedIndex: model.selectedThemeIndex,
                                            disabled: compute(model.allThemes, (t) => t.length === 0),
                                            disabledMessage: 'No themes defined.',
                                            onChange: (index: number) => {
                                                model.selectedThemeIndex.set(index);
                                                model.selectedTheme.set(model.allThemes.get()[index]);
                                            }
                                        }),
                                        horizontal({
                                            spacing: 4,
                                            content:[
                                            // a bunch of colour pickers to show the theme colours
                                            // 0th colour picker
                                            colourPicker({
                                                height: 3,
                                                colour: subscribeColourPicker(0),
                                                visibility: subscribeColourPickerActive(0),
                                            }),
                                            colourPicker({
                                                height: 3,
                                                colour: subscribeColourPicker(1),
                                                visibility: subscribeColourPickerActive(1),
                                            }),
                                            colourPicker({
                                                height: 3,
                                                colour: subscribeColourPicker(2),
                                                visibility: subscribeColourPickerActive(2),
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(3),
                                                visibility: subscribeColourPickerActive(3),
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(4),
                                                visibility: subscribeColourPickerActive(4),
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(5),
                                                visibility: subscribeColourPickerActive(5),
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(6),
                                                visibility: subscribeColourPickerActive(6),
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(7),
                                                visibility: subscribeColourPickerActive(7),
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(8),
                                                visibility: subscribeColourPickerActive(8),
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(9),
                                                visibility: subscribeColourPickerActive(9),
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(10),
                                                visibility: subscribeColourPickerActive(10),
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(11),
                                                visibility: subscribeColourPickerActive(11),
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(12),
                                                visibility: subscribeColourPickerActive(12),
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(13),
                                                visibility: subscribeColourPickerActive(13),
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(14),
                                                visibility: subscribeColourPickerActive(14),
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(15),
                                                visibility: subscribeColourPickerActive(15),
                                            }),
                                        ]}),
                                        horizontal({
                                            spacing: 4,
                                            content: [
                                            // second row
                                            colourPicker({
                                                colour: subscribeColourPicker(16),
                                                visibility: subscribeColourPickerActive(16)
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(17),
                                                visibility: subscribeColourPickerActive(17)
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(18),
                                                visibility: subscribeColourPickerActive(18)
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(19),
                                                visibility: subscribeColourPickerActive(19)
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(20),
                                                visibility: subscribeColourPickerActive(20)
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(21),
                                                visibility: subscribeColourPickerActive(21)
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(22),
                                                visibility: subscribeColourPickerActive(22)
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(23),
                                                visibility: subscribeColourPickerActive(23)
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(24),
                                                visibility: subscribeColourPickerActive(24)
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(25),
                                                visibility: subscribeColourPickerActive(25)
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(26),
                                                visibility: subscribeColourPickerActive(26)
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(27),
                                                visibility: subscribeColourPickerActive(27)
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(28),
                                                visibility: subscribeColourPickerActive(28)
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(29),
                                                visibility: subscribeColourPickerActive(29)
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(30),
                                                visibility: subscribeColourPickerActive(30)
                                            }),
                                            colourPicker({
                                                colour: subscribeColourPicker(31),
                                                visibility: subscribeColourPickerActive(31)
                                            }),
                                        ]})
                                    ]
                                })
                            }),
                        box({
                            text: 'Pick a mode',
                            content:
                                vertical({
                                    padding: 10,
                                    spacing: 5,
                                    content: [
                                        dropdown({
                                            items: compute(model.allModes, (modes) => modes.map((mode)=>mode.name)),
                                            selectedIndex: model.selectedModeIndex,
                                            disabled: compute(model.allModes, m => m.length === 0),
                                            disabledMessage: 'No modes defined',
                                            onChange: (index:number) => {
                                                model.selectedModeIndex.set(index);
                                                model.selectedMode.set(model.allModes.get()[index]);
                                            }
                                        }),
                                        horizontal([
                                            label({
                                                height: 20,
                                                width: 155,
                                                alignment: 'left',
                                                text: 'Choose two-tone base colour:',
                                                visibility: compute(model.selectedMode, mode => {
                                                    debug(`mode: ${JSON.stringify(mode?.name)}`)
                                                    if (mode?.name==='Two-tone') return "visible";
                                                    return "none"
                                                    }
                                                ),
                                            }),
                                            colourPicker({
                                                colour: 0,
                                                visibility: compute(model.selectedMode, mode => {
                                                    debug(`mode: ${JSON.stringify(mode?.name)}`)
                                                    if (mode?.name==='Two-tone') return "visible";
                                                    return "none"
                                                    }
                                                ),
                                                onChange: (colourChosen:Colour) =>
                                                    model.selectedTwoToneBase.set(colourChosen)
                                            })
                                        ]),
                                        label({
                                            height: 20,
                                            // padding: {top: 5},
                                            alignment: 'centred',
                                            text: compute(model.selectedMode, mode => {
                                                if (mode) return `${mode.description}`;
                                                return 'No mode selected';
                                            })
                                        })
                                    ]
                                })
                        }),
                        toggle({
                            text: ' Select rides to apply theme ==>',
                            onChange: (isPressed) => {
                                const rides = map.rides.filter(ride => ride.classification === "ride");
                                rides.forEach(ride => {
                                    debug(`ride name: ${ride.name}, ride type: ${ride.type}`)
                                })
                            }
                        }),
                        button({
                            text: 'Set ride colours according to mode',
                            disabled: compute(model.selectedMode , (mode) => !mode),
                            onClick: () => colourRides(),
                        }),
                    ])
                ]}
            ),
        // Ride Lock Section
        vertical([

        ])
	],
});

function onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }
