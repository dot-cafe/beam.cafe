import {action, observable} from 'mobx';
import {localStorageUtils}  from '../../utils/local-storage-utils';

type InternalSettings = {
    autoPause: boolean;
    strictSession: boolean | null;
    theme: 'light' | 'dark';
};

class Settings {

    // TODO: Add reset-switch
    @observable private readonly settings: InternalSettings = {
        autoPause: false,
        strictSession: false,
        theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
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
    public set<K extends keyof InternalSettings>(key: K, value: InternalSettings[K]): void {
        this.settings[key] = value;
        this.syncLocal();
    }

    public get<K extends keyof InternalSettings>(key: K): InternalSettings[K] {
        return this.settings[key];
    }
}

export const settings = new Settings();
