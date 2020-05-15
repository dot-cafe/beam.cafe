import {observer}                                         from 'mobx-react';
import {Component, h}                                     from 'preact';
import {NotificationSettings, pushNotification, settings} from '../../../../state';
import {bind, cn}                                         from '../../../../utils/preact-utils';
import {Switch, SwitchState}                              from '../../../components/Switch';
import {Toast}                                            from '../../../overlays/Toast';
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
            const granted = Notification.permission === 'granted';
            settings.set('notifications', granted ? true : 'intermediate');

            if (!granted) {

                // Request permissions
                Notification.requestPermission().then(status => {
                    settings.set('notifications', status === 'granted');
                });
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
                Toast.instance.set({
                    text: 'Notifications are hidden if app is visible!',
                    type: 'warning'
                });
            } else {
                Toast.instance.set({
                    text: 'Failed to show Notification',
                    type: 'error'
                });
            }
        }
    }

    render() {
        const notify = settings.get('notifications');

        // TODO: Clean up base-styles mess
        // TODO: span::before -> separator!
        return (
            <div className={cn(baseStyles.section, styles.notifications, {
                [styles.enabled]: notify === true
            })}>

                <section className={baseStyles.standalone}>
                    <header>
                        <bc-icon name="notification"/>
                        <h3>Turn on Notifications</h3>
                        <Switch state={notify}
                                onChange={this.toggle}/>
                    </header>
                </section>

                <section className={cn(styles.optionsHeader, baseStyles.borderless)}>
                    <h3>Customize</h3>

                    <button onClick={this.testNotifications}>Test</button>
                </section>

                <section className={cn(styles.options, baseStyles.borderless)}>
                    <div>
                        <h3>Hide notifications if app is visible</h3>
                        <Switch state={this.setting('hideIfAppIsVisible') as SwitchState}
                                onChange={this.option('hideIfAppIsVisible')}/>
                    </div>

                    <div>
                        <h3>Connection lost / re-established</h3>
                        <Switch state={this.setting('connectionChange') as SwitchState}
                                onChange={this.option('connectionChange')}/>
                    </div>
                </section>

                <section className={cn(styles.optionsHeader, baseStyles.borderless)}>
                    <h3>Notify me when a upload ...</h3>
                </section>

                <section className={cn(styles.options, baseStyles.borderless)}>
                    <UploadStateNotification/>
                </section>
            </div>
        );
    }
}
