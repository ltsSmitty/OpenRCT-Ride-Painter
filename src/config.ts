/* eslint-disable no-unused-vars */
const namespace = 'random_ride_colours';
const changeRideColourKey = `${namespace}.changeRideColour`;

// Retrieve given key from sharedStorage, returns defaultValue if not found.
export const getConfig = (key, defaultValue) => context.sharedStorage.get(key, defaultValue);

// Stores given value under given key in sharedStorage.
export const setConfig = (key, value) => context.sharedStorage.set(key, value);
