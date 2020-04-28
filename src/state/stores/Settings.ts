import {action, observable} from 'mobx';
import {localStorageUtils}  from '../../utils/local-storage-utils';

type InternalSettings = {
    autoPause: boolean;
};

class Settings {
    @observable private readonly settings: InternalSettings = {
        autoPause: false
    };

    constructor() {
        const settings = localStorageUtils.getJSON('settings');

        if (settings !== null) {
            Object.assign(this.settings, settings);
        }
    }

    private syncLocal(): void {
        localStorageUtils.setJSON('settings', this.settings);
    }

    @action
    public updateConfig<K extends keyof InternalSettings>(key: K, value: InternalSettings[K]): void {
        this.settings[key] = value;
        this.syncLocal();
    }

    public get<K extends keyof InternalSettings>(key: K): InternalSettings[K] {
        return this.settings[key];
    }
}

export const settings = new Settings();
