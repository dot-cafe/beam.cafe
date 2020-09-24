import {Toast}    from '@overlays/Toast';
import {uid}      from '@utils/uid';
import {settings} from './Settings';

export type NotificationPayload = {
    title: string;
    body?: string;
    image?: string;
};

export type ResolveNotification = 'click' | 'close' | string | null;

// Currently active notifications
const pendingRequests = new Map<string, (s: ResolveNotification) => void>();

// Wait until service worker is initialized
void navigator.serviceWorker.ready.then(() => {

    // Listen to resolved notifications
    navigator.serviceWorker.addEventListener('message', ev => {
        const {type, tag, action} = ev.data;

        if (type === 'notify-reply') {
            const resolver = pendingRequests.get(tag);

            if (resolver) {
                resolver(action);
            }
        }
    });
});

// Internal notification-request function
// TODO: What about actions on chromium-based browsers?
const requestNotification = (options: NotificationPayload, interaction = false): string | null => {

    // Check if notifications are enabled
    if (settings.notifications.turnedOn !== true) {
        return null;
    }

    // Check if document has to be visible
    if (settings.notifications.hideIfAppIsVisible &&
        document.visibilityState === 'visible') {
        return null;
    }

    // Check if notifications are actually allowed
    if (Notification.permission !== 'granted') {
        settings.notifications.turnedOn = false;

        Toast.instance.show({
            text: 'Notifications are disabled by your browser.',
            body: 'Go to Settings > Notifications to turn them on'
        });

        return null;
    }

    const {controller} = navigator.serviceWorker;

    if (!controller) {
        return null;
    }

    const tag = uid('notify');

    // Safari "polyfill"...
    if (window.safari) {
        const {title, body} = options;

        const notifications = new Notification(title, {
            badge: '/favicon.ico',
            icon: '/favicon.ico',
            requireInteraction: interaction,
            renotify: true,
            body
        });

        const resolve = (type: ResolveNotification): void => {
            const item = pendingRequests.get(tag);

            if (item) {
                item(type);
            }
        };

        notifications.onerror = () => resolve('close');
        notifications.onclose = () => resolve('close');
        notifications.onclick = () => resolve('click');
    } else {
        controller.postMessage({
            type: 'notify',
            data: {interaction, ...options},
            tag
        });
    }

    return tag;
};

/**
 * Shows a notification and expects a response from the user
 * @param options
 */
export const showNotification = async (options: NotificationPayload): Promise<ResolveNotification> => {
    return new Promise<ResolveNotification>(resolve => {
        const tag = requestNotification(options, true);

        if (tag) {
            pendingRequests.set(tag, resolve);
        } else {
            resolve(null);
        }
    });
};


/**
 * Shows a notification without reacting to any user-interaction, returns boolean
 * whether the notification got displayed.
 * @param options
 */
export const pushNotification = (options: NotificationPayload): boolean => {
    return requestNotification(options, false) !== null;
};
