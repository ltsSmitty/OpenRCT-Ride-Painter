import { button, compute, horizontal } from "openrct2-flexui";
import FeatureController from "../controllers/FeatureController";
import ColourChange from "../themeSettings/ColourChange";

const ridePaintSection = (fc: FeatureController) => {
  const rc = fc.rideController;
  const { rideHistory } = rc;

  const layout = horizontal({
    // height:80,
    content: [
      // undo button
      button({
        text: "Undo",
        padding: "5px",
        disabled: compute(rideHistory.undoPointer, (pointer) => pointer <= 0),
        onClick: () => rideHistory.undoLastPaint(),
      }),

      // ride paint button
      button({
        height: 30,
        padding: "5px",
        // width: "80%",
        text: "6. Paint selected rides",
        disabled: compute(
          fc.rideController.selectedRides,
          (rides) => (rides?.length || -1) <= 0
        ),
        onClick: () => ColourChange.colourRides(fc),
        tooltip: `Nothing changing?
                                    Make sure to enable 'Allow repainting of already painted rides'`,
      }),

      // paint redo button
      button({
        text: "Redo",
        padding: "5px",
        disabled: compute(
          rideHistory.undoPointer,
          (pointer) => pointer >= rideHistory.ridePaintHistory.get().length - 1
        ),
        onClick: () => rideHistory.redoPaint(),
      }),
    ],
  });

  return layout;
};

export default ridePaintSection;
