import { themeWindow } from './window2';
/// <reference path="../lib/openrct2.d.ts" />

registerPlugin({
  name: 'drawing test',
  version: '0.1',
  authors: ['ltsSmitty'],
  type: 'remote',
  licence: 'GPL-3.0',
  main: () => {
    ui.registerMenuItem("Drawing test", () => themeWindow.open())
  }
});
