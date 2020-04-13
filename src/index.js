/* eslint-disable */
if (env.NODE_ENV === 'development') {

    // Inject react-hot-loader
    const runtime = require('react-refresh/runtime');
    runtime.injectIntoGlobalHook(window);

    if (module.hot) {
        module.hot.accept();
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
