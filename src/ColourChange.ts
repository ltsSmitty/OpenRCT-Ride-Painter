/// <reference path="../lib/openrct2.d.ts" />

export default class ColourChange {
  /**
 * @param part is defined from ColourChange table:
 * 0: TrackColourMain,
 * 1: TrackColourAdditional,
 * 2: TrackColourSupports,
 * 3: VehicleColourBody,
 * 4: VehicleColourTrim,
 * 5: VehicleColourTernary,
 * 6: VehicleColourScheme,
 * 7: EntranceStyle
 * @param colour is from 0-31
 */
  private static setRideColourPart = (ride: Ride, part:number, colour: number) => {
    if (colour === -1) return;
    if (colour >= 0 && colour < 32) {
      context.executeAction('ridesetappearance', {
        ride: ride.id,
        type: part,
        value: colour,
        index: 0,
        flags: 0,
      },
      // Awkward callback but necessary
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => { });
    } else {
      /* eslint-disable no-console */
      console.log(`Colour not changed for ride ${ride.name} for part ${part}.
      Given colour ${colour} is outside the acceptable range of 0-31.
      To keep a colour value unchanged without getting this warning, pass in '-1' for the colour value.`);
    }
  };

  /**
 * To not change a colour for a param, input -1 for the param.
 */
  public static setRideColour = (
    ride: Ride,
    mainColour:number = -1,
    additionalColour: number = -1,
    supportsColour: number = -1,
    vehicleBodyColour: number = -1,
    vehicleTrimColour: number = -1,
    vehicleTernaryColour: number = -1,
  ) => {
    ColourChange.setRideColourPart(ride, 0, mainColour);
    ColourChange.setRideColourPart(ride, 1, additionalColour);
    ColourChange.setRideColourPart(ride, 2, supportsColour);
    ColourChange.setRideColourPart(ride, 3, vehicleBodyColour);
    ColourChange.setRideColourPart(ride, 4, vehicleTrimColour);
    ColourChange.setRideColourPart(ride, 5, vehicleTernaryColour);
  };

  public static setRideColourTracks = (
    ride:Ride,
    mainColour:number,
    additionalColour: number,
    supportsColour: number,
  ) => {
    ColourChange.setRideColourPart(ride, 0, mainColour);
    ColourChange.setRideColourPart(ride, 1, additionalColour);
    ColourChange.setRideColourPart(ride, 2, supportsColour);
  };

  public static setRideColourVehicle = (
    ride:Ride,
    vehicleBodyColour: number,
    vehicleTrimColour: number,
    vehicleTernaryColour: number,
  ) => {
    ColourChange.setRideColourPart(ride, 3, vehicleBodyColour);
    ColourChange.setRideColourPart(ride, 4, vehicleTrimColour);
    ColourChange.setRideColourPart(ride, 5, vehicleTernaryColour);
  };

  public static setAllPartsBlack = (ride:Ride): void => {
    ColourChange.setRideColour(ride, 0, 0, 0, 0, 0, 0);
  };

  public static setRandomTrackColour = (ride:Ride): void => {
    ColourChange.setRideColourTracks(ride,
      context.getRandom(0, 31), context.getRandom(0, 31),
      context.getRandom(0, 31));
  };

  public static setRandomVehicleColour = (ride:Ride): void => {
    ColourChange.setRideColourVehicle(ride,
      context.getRandom(0, 31),
      context.getRandom(0, 31),
      context.getRandom(0, 31));
  };

  public static setRideStationStyle = (ride:Ride, stationStyle: number) => {
    ColourChange.setRideColourPart(ride, 7, stationStyle);
  };
  // end of class
}
