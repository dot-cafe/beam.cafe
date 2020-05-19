// https://github.com/Microsoft/TypeScript/issues/11781
declare let self: ServiceWorkerGlobalScope;
export default null;

// Hot reload does not work for service workers
if (module.hot) {
    module.hot.decline();
}

// See https://stackoverflow.com/questions/38168276/navigator-serviceworker-controller-is-null-until-page-refresh
self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

const postMessage = async (message: unknown) => {
    return self.clients.matchAll().then(clients => {
        for (const client of clients) {
            client.postMessage(message);
        }
    });
};

self.addEventListener('message', ev => {
    const {type, tag, data} = ev.data;

    if (type === 'notify') {
        const {title, body, interaction} = data;

        ev.waitUntil(self.registration.showNotification(title, {
            badge: '/favicon.ico',
            icon: '/favicon.ico',
            requireInteraction: !!interaction,
            renotify: true,
            tag, body
        }));
    }
});

self.addEventListener('notificationclick', ev => {
    ev.notification.close();

    ev.waitUntil(postMessage({
        type: 'notify-reply',
        tag: ev.notification.tag,
        action: ev.action || 'click'
    }));
});

self.addEventListener('notificationclose', ev => {
    ev.waitUntil(postMessage({
        type: 'notify-reply',
        tag: ev.notification.tag,
        action: 'close'
    }));
});
