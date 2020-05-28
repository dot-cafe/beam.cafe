import {Switch, SwitchState}                              from '@components/Switch';
import {Toast}                                            from '@overlays/Toast';
import {NotificationSettings, pushNotification, settings} from '@state/index';
import {bind, cn}                                         from '@utils/preact-utils';
import {observer}                                         from 'mobx-react';
import {Component, h}                                     from 'preact';
import baseStyles                                         from './_base.module.scss';
import styles                                             from './Notifications.module.scss';
import {UploadStateNotification}                          from './UploadStateNotification';

@observer
export class Notifications extends Component {

    setting(key: keyof NotificationSettings) {
        return settings.get('notificationSettings')[key];
    }

    option(key: keyof Omit<NotificationSettings, 'uploadStateChange'>) {
        return (newValue: boolean) => {
            settings.get('notificationSettings')[key] = newValue;
            settings.syncLocal();
        };
    }

    @bind
    toggle() {

        // TODO: What if the user removed permissions during runtime?
        const state = settings.get('notifications');
        if (state === true) {
            settings.set('notifications', false);
        } else if (state === false) {
            switch (Notification.permission) {
                case 'default': {
                    settings.set('notifications', 'intermediate');

                    /**
                     * Request permissions, safari again is really slow in
                     * catching up with other browser so we have to provide an callback.
                     */
                    const resolve = (status: string) => settings.set('notifications', status === 'granted');
                    const request = Notification.requestPermission(resolve);

                    if (request instanceof Promise) {
                        request.then(resolve);
                    }

                    break;
                }
                case 'denied': {
                    settings.set('notifications', false);

                    Toast.instance.show({
                        text: 'Notifications are disabled by your browser!',
                        body: 'Check the site settings of your browser to enable notifications for this site.',
                        type: 'warning'
                    });
                    break;
                }
                case 'granted': {
                    settings.set('notifications', true);
                    break;
                }
            }
        }
    }

    @bind
    testNotifications() {
        const success = pushNotification({
            title: 'Hello World!',
            body: 'Now go and share a file :)'
        });

        if (!success) {
            if (this.setting('hideIfAppIsVisible')) {
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
    }

    render() {
        const notify = settings.get('notifications');

        return (
            <div className={cn(baseStyles.section, styles.notifications, {
                [styles.enabled]: notify === true
            })}>

                <section className={baseStyles.standalone}>
                    <header>
                        <bc-icon name="notification"/>
                        <h3>Turn on Notifications</h3>
                        <Switch state={notify}
                                onChange={this.toggle}
                                aria-describedby="Turn on notifications"/>
                    </header>
                </section>

                <section className={cn(styles.optionsHeader, baseStyles.borderless)}>
                    <h3>Customize Notifications</h3>

                    <button onClick={this.testNotifications}
                            aria-label="Show test Notification">
                        <bc-tooltip content="Show test Notification"/>
                        <bc-icon name="notification-color"/>
                    </button>
                </section>

                <section className={cn(styles.options, baseStyles.borderless)}>
                    <div>
                        <h3>Hide notifications if app is visible</h3>
                        <Switch state={this.setting('hideIfAppIsVisible') as SwitchState}
                                onChange={this.option('hideIfAppIsVisible')}
                                aria-label="Hide notifications if app is visible"/>
                    </div>

                    <div>
                        <h3>Connection lost / re-established</h3>
                        <Switch state={this.setting('connectionChange') as SwitchState}
                                onChange={this.option('connectionChange')}
                                aria-label="Connection lost / re-established"/>
                    </div>

                    <div>
                        <h3>Update available</h3>
                        <Switch state={this.setting('updateAvailable') as SwitchState}
                                onChange={this.option('updateAvailable')}
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
    }
}
