/// <reference path="../lib/openrct2.d.ts" />
import themeChooser from './window';

registerPlugin({
  name: 'Random Ride Colours',
  version: '1.0',
  authors: ['ltsSmitty'],
  type: 'remote',
  licence: 'GPL-3.0',
  main: () => {
    ui.registerMenuItem("Theme Manager", () => themeChooser.open())
  }
});
