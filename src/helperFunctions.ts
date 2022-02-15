// Retrieve given key from sharedStorage, returns defaultValue if not found.
const getConfig = (key:string, defaultValue: any) => context.sharedStorage.get(key, defaultValue);

// Stores given value under given key in sharedStorage.
const setConfig = (key:string , value: any) => context.sharedStorage.set(key, value);

export { getConfig, setConfig}
