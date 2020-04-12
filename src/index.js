
/* eslint-disable no-console */
if (env.NODE_ENV === 'development') {
    const interopDefault = m => (m && m.default ? m.default : m);

    // Inject react-hot-loader
    const hotLoader = interopDefault(require('react-hot-loader'));
    hotLoader.preact(interopDefault(require('preact')));

    if (module.hot) {
        module.hot.accept()
    }
} else if (env.NODE_ENV === 'production') {
    console.log(`[INFO] Launching app v${env.VERSION}`);

    navigator.serviceWorker.register(
        '/sw.js'
    ).then(() => {
        console.log('[SW] Registration Successful!');
    }).catch(reason => {
        console.log('[SW] Registration failed:', reason);
    });
}

require('./app/index');
