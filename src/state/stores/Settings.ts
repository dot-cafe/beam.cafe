import {action, observable} from 'mobx';
import {SwitchState}        from '../../app/components/Switch';
import {localStorageUtils}  from '../../utils/local-storage-utils';
import {pick}               from '../../utils/pick';
import {socket}             from './Socket';

export type AvailableSettings = {
    reusableDownloadKeys: SwitchState;
    strictSession: SwitchState;
    theme: 'light' | 'dark';
    autoPause: boolean;
};

function hasKey<K extends string>(k: K, o: {}): o is { [_ in K]: {} } {
    return typeof o === 'object' && k in o;
}

class Settings {

    private static readonly SERVER_SIDE_SETTINGS: Partial<Array<keyof AvailableSettings>> = [
        'reusableDownloadKeys',
        'strictSession'
    ];

    public static readonly DEFAULT_SETTINGS: AvailableSettings = {
        theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
        reusableDownloadKeys: true,
        strictSession: false,
        autoPause: false
    };

    @observable private settings: AvailableSettings;

    constructor() {
        this.settings = {
            ...Settings.DEFAULT_SETTINGS,
            ...(localStorageUtils.getJSON('settings') as object || {})
        };
    }

    public syncLocal(): void {
        localStorageUtils.setJSON('settings', this.settings);
    }

    public syncServer() {
        const toSync = pick(this.settings, Settings.SERVER_SIDE_SETTINGS);

        socket.request('settings', toSync).catch(() => {

            // Fallback to default settings
            const defaults = pick(Settings.DEFAULT_SETTINGS, Settings.SERVER_SIDE_SETTINGS);
            Object.assign(this.settings, defaults);
        });
    }

    @action
    public apply(settings: Partial<AvailableSettings>): void {
        Object.assign(this.settings, settings);
    }

    @action
    public set<K extends keyof AvailableSettings>(key: K, value: AvailableSettings[K]): void {

        // Type-checking for "in" is somewhat broken or I'm just dumb
        // see https://github.com/Microsoft/TypeScript/issues/10485
        if (Settings.SERVER_SIDE_SETTINGS.includes(key)) {

            // TODO: Mixing booleans and string is definitely not best practice, change that later!
            /* eslint-disable @typescript-eslint/no-explicit-any */
            this.settings[key] = 'intermediate' as any;

            socket.request('settings', {
                [key]: value
            }).then(() => {
                this.settings[key] = value;
            }).catch(() => {
                this.settings[key] = Settings.DEFAULT_SETTINGS[key];
            });
        } else {
            this.settings[key] = value;
            this.syncLocal();
        }
    }

    @action
    public resetServerSide(): void {
        this.settings = {
            ...Settings.DEFAULT_SETTINGS,
            ...(localStorageUtils.getJSON('settings') as object || {})
        };

        localStorageUtils.setJSON('settings', this.settings);
    }

    public get<K extends keyof AvailableSettings>(key: K): AvailableSettings[K] {
        return this.settings[key];
    }
}

export const settings = new Settings();
