/* eslint-disable max-len */
/// <reference path="../lib/openrct2.d.ts" />

// eslint-disable-next-line import/no-extraneous-dependencies
import { box, button, compute, colourPicker ,dropdown, horizontal, label,
    store, window, vertical, toggle, Colour } from 'openrct2-flexui';
import { debug } from './helpers/logger';

// eslint-disable-next-line import/prefer-default-export
export const themeWindow = window({
	title: 'ToggleTest',
	width: 700,
    minWidth: 280,
    maxWidth: 900,
	height: 300,
	minHeight: 400,
	maxHeight: 500,
	padding: 8,
	onOpen: () => {
	},
    onUpdate: () => {
    },
	content: [
        ]
    });
