import {Switch}                     from '@components/Switch';
import {Toast}                      from '@overlays/Toast';
import {pushNotification, settings} from '@state/index';
import {UploadExtensions}           from '@state/models/UploadExtensions';
import {cn}                         from '@utils/preact-utils';
import {observer}                   from 'mobx-react';
import {FunctionalComponent, h}     from 'preact';
import baseStyles                   from './_base.module.scss';
import styles                       from './Notifications.module.scss';
import {UploadStateNotification}    from './UploadStateNotification';

export const Notifications: FunctionalComponent = observer(() => {
    const {notifications} = settings;

    const toggle = () => {

        const {turnedOn} = notifications;

        if (turnedOn === true) {
            notifications.turnedOn = false;
        } else if (turnedOn === false) {
            switch (Notification.permission) {
                case 'default': {
                    notifications.turnedOn = 'intermediate';

                    /**
                     * Request permissions, safari again is really slow in
                     * catching up with other browser so we have to provide an callback.
                     */
                    const resolve = (status: string) => notifications.turnedOn = status === 'granted';
                    const request = Notification.requestPermission(resolve);

                    if (request instanceof Promise) {
                        void request.then(resolve);
                    }

                    break;
                }
                case 'denied': {
                    notifications.turnedOn = false;

                    Toast.instance.show({
                        text: 'Notifications are disabled by your browser!',
                        body: 'Check the site settings of your browser to enable notifications for this site.',
                        type: 'warning'
                    });
                    break;
                }
                case 'granted': {
                    notifications.turnedOn = true;
                    break;
                }
            }
        }
    };

    const testNotifications = () => {
        const success = pushNotification({
            title: 'Hello World!',
            body: 'Now go and share a file :)'
        });

        if (!success) {
            if (notifications.hideIfAppIsVisible) {
                Toast.instance.show({
                    text: 'Notifications are hidden if app is visible!',
                    body: 'Disable the option to view a notification if the app is open.',
                    type: 'warning'
                });
            } else {
                Toast.instance.show({
                    text: 'Failed to show Notification',
                    body: 'Try closing other beam.cafe tabs!',
                    type: 'error'
                });
            }
        }
    };

    return (
        <div className={cn(baseStyles.section, styles.notifications, {
            [styles.enabled]: notifications.turnedOn === true
        })}>

            <section className={baseStyles.standalone}>
                <header>
                    <bc-icon name="notification"/>
                    <h3>Turn on Notifications</h3>
                    <Switch state={notifications.turnedOn}
                            onChange={toggle}
                            aria-describedby="Turn on notifications"/>
                </header>
            </section>

            <section className={cn(styles.optionsHeader, baseStyles.borderless)}>
                <h3>Customize Notifications</h3>

                <button onClick={testNotifications}
                        aria-label="Show test Notification">
                    <bc-tooltip content="Show test Notification"/>
                    <bc-icon name="notification-color"/>
                </button>
            </section>

            <section className={cn(styles.options, baseStyles.borderless)}>
                <div>
                    <h3>Hide notifications if app is visible</h3>
                    <Switch state={notifications.hideIfAppIsVisible}
                            onChange={v => notifications.hideIfAppIsVisible = v}
                            aria-label="Hide notifications if app is visible"/>
                </div>

                <div>
                    <h3>Connection lost / re-established</h3>
                    <Switch state={notifications.onConnectionChange}
                            onChange={v => notifications.onConnectionChange = v}
                            aria-label="Connection lost / re-established"/>
                </div>

                <div>
                    <h3>Update available</h3>
                    <Switch state={notifications.onUpdateAvailable}
                            onChange={v => notifications.onUpdateAvailable = v}
                            aria-label="Update available"/>
                </div>
            </section>

            <section className={cn(styles.optionsHeader, baseStyles.borderless)} aria-rule="banner">
                <h3>Notify me when a upload...</h3>
            </section>

            <section className={cn(styles.options, baseStyles.borderless)}>
                <UploadStateNotification/>
            </section>
        </div>
    );
});
