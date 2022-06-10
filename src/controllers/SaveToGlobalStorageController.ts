import { sharedStorageNamespace } from "../helpers/environment";

export default class GlobalSaveController {
    lookupKeys;

    exampleKey!: string;

    constructor() {
        this.lookupKeys = {
            exampleKey: `${sharedStorageNamespace}.thingToSave`,
        };
    }

    getValue(value: keyof typeof this.lookupKeys) {
        const thisKey = this.lookupKeys[value] as string;
        return context.sharedStorage.get(thisKey, this[value]);
    }

    setValue<T>(key: keyof typeof this.lookupKeys, value: T) {
        const thisKey = this.lookupKeys[key] as string;
        context.sharedStorage.set(thisKey, value);
    }
}
