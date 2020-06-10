import {SwitchState}               from '@components/Switch';
import {socket}                    from '@state/stores/Socket';
import {clone}                     from '@utils/clone';
import {localStorageUtils}         from '@utils/local-storage-utils';
import {autorun, observable, toJS} from 'mobx';
import {UploadState}               from '../models/Upload';

export type AvailableSettings = {
    theme: 'light' | 'dark';
    themeColor: [number, number, number];
    highContrast: boolean;
    autoPause: boolean;
    processDuplicateFilenames: boolean;

    notifications: {
        turnedOn: SwitchState;
        hideIfAppIsVisible: boolean;

        onUpdateAvailable: boolean;
        onConnectionChange: boolean;
        onUploadStateChange: Array<UploadState>;
    };

    remote: {
        reusableDownloadKeys: SwitchState;
        strictSession: SwitchState;
        allowStreaming: SwitchState;
    };
};

const defaultSettings: AvailableSettings = {

    // Local settings
    theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    themeColor: [220, 94, 61],
    highContrast: false,
    autoPause: false,
    processDuplicateFilenames: true,

    // Notifications related settings
    notifications: {
        turnedOn: false,
        hideIfAppIsVisible: true,

        onUpdateAvailable: false,
        onConnectionChange: true,
        onUploadStateChange: [
            'awaiting-approval',
            'running'
        ]
    },

    // Server-side settings
    remote: {
        reusableDownloadKeys: true,
        strictSession: false,
        allowStreaming: true
    }
};

export const settings = observable<AvailableSettings>({
    ...clone(defaultSettings),
    ...(localStorageUtils.getJSON('settings') || {})
});

// Resets all settings
export const resetSettings = (): void => {
    Object.assign(settings, clone(defaultSettings));
};

// Resets just the remote settings
export const resetRemoteSettings = (base = clone(defaultSettings.remote)): void => {
    Object.assign(settings.remote, base);
};

// Syncs currently saved remote settings
export const syncRemoteSettings = () => {
    socket.request('settings', settings.remote)
        .catch(() => Object.assign(settings.remote, clone(defaultSettings.remote)));
};

// Sync local settings
autorun(() => {
    localStorageUtils.setJSON('settings', toJS(settings));
});

// Sync remote settings
/* eslint-disable no-console */
let previousRemoteState = clone(defaultSettings.remote);
autorun(() => {
    const remoteSettings = toJS(settings.remote);
    socket.request('settings', remoteSettings)
        .then(() => previousRemoteState = remoteSettings)
        .catch(() => {
            console.warn('[CFG] Failed to update settings');
            Object.assign(settings.remote, previousRemoteState);
        });
});
