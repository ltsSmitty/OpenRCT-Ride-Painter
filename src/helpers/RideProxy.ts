import { debug } from "./logger";

export type RideProxy = {
  id: number;
  name: string;
  vehicleColours: VehicleColour[];
  colourSchemes: TrackColour[];
  stationStyle: number;
};

export const convertRideToProxy = (ride: Ride): RideProxy => {
  const { id, name, vehicleColours, colourSchemes, stationStyle } = ride;
  return {
    id,
    name,
    vehicleColours: [vehicleColours[0]],
    colourSchemes: [colourSchemes[0]],
    stationStyle,
  };
};

export const hydrateRideProxy = (rideProxy: RideProxy): Ride => {
  debug(`prepping to rehydrate ${JSON.stringify(rideProxy)}`);
  return map.rides.filter((ride) => ride.id === rideProxy.id)[0];
};

// map all rides into proxies
// save into an array
