/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference path="../lib/openrct2.d.ts" />

import {
  box,
  button,
  compute,
  colourPicker,
  dropdown,
  horizontal,
  label,
  dropdownSpinner,
  store,
  window,
  vertical,
  toggle,
  Colour,
} from "openrct2-flexui";
import { debug } from "./helpers/logger";
import ColourChange from "./themeSettings/ColourChange";
import themeSectionElements from "./Components/themeSection";
import { modeSectionElements } from "./Components/modeSection";
import groupingSectionElements from "./Components/groupingSection";
import rideSelectionElements from "./Components/rideSelectionSection";
import settingsSectionElements from "./Components/settingsSection";
import stationStyleElements from "./Components/stationStyleSection";
import FeatureController from "./controllers/FeatureController";
import RidePaintController from "./Components/RideRepaintSection";
import ThemeCreationController from "./Components/ThemeCreationSection";

// Set up empty methods that will be overwritten inside StateWatcher
export class WindowWatcher {
  // Event that triggers on window open
  static onWindowOpen?: () => void;

  // Event that triggers every frame update of the window
  static onWindowUpdate?: () => void;

  // Event that triggers on window close
  static onWindowClose?: () => void;
}

export const themeWindow = (featureController: FeatureController) => {
  const {
    rideController,
    themeController,
    groupingController,
    modeController,
    stationController,
    settingsController,
  } = featureController;

  debug(
    `themeWindow init, num rides: ${rideController.all
      .get()
      .map((ride) => ride.name)}`
  );

  const rpc = new RidePaintController(featureController, 15);
  const tcs = new ThemeCreationController(themeController);

  return window({
    title: "Ride Painter",
    width: 700,
    maxWidth: 700,
    minWidth: 500,
    height: 600,
    maxHeight: 600,
    minHeight: 600,
    spacing: 10,
    padding: 8,
    colours: [20, 7],
    onOpen: () => {
      if (WindowWatcher.onWindowOpen) {
        WindowWatcher.onWindowOpen();
      }
    },
    onUpdate: () => {
      if (WindowWatcher.onWindowUpdate) {
        WindowWatcher.onWindowUpdate();
      }
    },
    onClose: () => {
      if (WindowWatcher.onWindowClose) {
        WindowWatcher.onWindowClose();
      }
    },
    content: [
      // split into two columns
      horizontal({
        content: [
          // left column
          vertical({
            width: 400,
            content: [
              // TOP ROW: THEME PICKER & CREATOR
              horizontal({
                content: [
                  // THEME PICKER
                  themeSectionElements(themeController),
                  // THEME CREATOR
                  // tcs.generateLayout(),
                ],
              }),
              // SECOND ROW: MODE PICKER
              modeSectionElements(modeController),
              // THIRD ROW: GROUP BY
              groupingSectionElements(groupingController),
              // FOURTH ROW: RIDE/TYPE SELECTION
              rideSelectionElements(rideController),
              // SETTINGS
              settingsSectionElements(settingsController),
              stationStyleElements(stationController, rideController),
              button({
                height: 30,
                padding: "5px",
                // width: "80%",
                text: "6. Paint selected rides",
                disabled: compute(
                  rideController.selectedRides,
                  (rides) => (rides?.length || -1) <= 0
                ),
                onClick: () => ColourChange.colourRides(featureController),
                tooltip: `Nothing changing?
                                    Make sure to enable 'Allow repainting of already painted rides'`,
              }),
            ],
          }),

          // right column
          vertical({
            content: [rpc.layoutTest()],
          }),
        ],
      }),
    ],
  });
};
