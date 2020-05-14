import {off, on} from '../../utils/events';

export type NotificationPayload = NotificationOptions & {
    title: string;
};

export type ResolveNotification = {
    event: 'click' | 'close' | 'error';
};

export class Notify {
    public static readonly TIMEOUT = 4000;

    /**
     * Shows a notification and returns a promise with the users reaction
     * @param options
     */
    public static showNotification(options: NotificationPayload): Promise<ResolveNotification> {
        const {title, ...rest} = options;

        const notification = new Notification(title, {
            badge: '/favicon.ico',
            icon: '/favicon.ico',
            requireInteraction: true,
            ...rest
        });

        return new Promise<ResolveNotification>(resolve => {
            const args = on(notification, ['click', 'close', 'error', 'show'], (e: Event) => {
                switch (e.type) {
                    case 'click':
                    case 'error':
                    case 'close': {
                        off(...args);
                        resolve({event: e.type});
                    }
                }
            });
        });
    }

    /**
     * Shows a notification and closes it after a few seconds
     * @param options
     * @param timeout
     */
    public static pushNotification(options: NotificationPayload, timeout = Notify.TIMEOUT): void {
        const {title, ...rest} = options;

        const notification = new Notification(title, {
            badge: '/favicon.ico',
            icon: '/favicon.ico',
            requireInteraction: false,
            ...rest
        });

        setTimeout(() => notification.close(), timeout);
    }
}
