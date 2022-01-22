/* eslint-disable no-console */
/// <reference path="../lib/openrct2.d.ts" />

// eslint-disable-next-line import/prefer-default-export
export const getRides = ():Ride[] => map.rides.filter((ride:Ride) => ride.classification === 'ride');
