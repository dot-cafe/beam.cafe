export type NotificationPayload = {
    title: string;
    body?: string;
    image?: string;
    interaction?: boolean;
};

export type ResolveNotification = 'click' | 'close' | string | null;

// Currently active notifications
const pendingRequests = new Map<string, (s: ResolveNotification) => void>();

// UID Generator
const uid = () => `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e14).toString(36)}`;

// Wait until service worker is initialized
navigator.serviceWorker.ready.then(() => {

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

/**
 * TODO: What about actions on chromium-based browsers?
 * Shows a notification and expects a response from the user
 * @param options
 */
export const showNotification = (options: NotificationPayload): Promise<ResolveNotification> => {
    return new Promise<ResolveNotification>(resolve => {
        const {controller} = navigator.serviceWorker;

        if (!controller) {
            return resolve(null);
        }

        const tag = uid();
        controller.postMessage({
            type: 'notify',
            data: options,
            tag
        });

        if (options.interaction) {
            pendingRequests.set(tag, resolve);
        } else {
            resolve(null);
        }
    });
};
