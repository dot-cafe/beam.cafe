import {Component, h}     from 'preact';
import {observer}         from 'mobx-react';
import {settings}         from '@state/index';
import {UploadState}      from '@state/models/Upload';
import {UploadExtensions} from '@state/models/UploadExtensions';
import {bind}             from '@utils/preact-utils';
import {DropDown}         from '@components/DropDown';
import styles             from './UploadStateNotification.module.scss';

@observer
export class UploadStateNotification extends Component {
    private static namings = UploadExtensions.availableNotifications;

    get uploadStateChange() {
        return settings.get('notificationSettings').uploadStateChange;
    }

    get availableSettings() {
        return UploadStateNotification.namings
            .filter(v => !this.uploadStateChange.includes(v[0]));
    }

    @bind
    replaceState(oldIndex: number) {
        return (key: string | number) => {
            const notificationSettings = settings.get('notificationSettings');
            const copy = [...this.uploadStateChange];
            copy.splice(oldIndex, 1, key as UploadState);

            settings.set('notificationSettings', {
                ...notificationSettings,
                uploadStateChange: copy
            });
        };
    }

    @bind
    watchState(key: string | number) {
        settings.set('notificationSettings', {
            ...settings.get('notificationSettings'),
            uploadStateChange: [
                ...this.uploadStateChange, key as UploadState
            ]
        });
    }

    @bind
    unwatchState(key: string) {
        return () => {
            const notificationSettings = settings.get('notificationSettings');

            settings.set('notificationSettings', {
                ...notificationSettings,
                uploadStateChange: [
                    ...this.uploadStateChange.filter(
                        value => value !== key
                    )
                ]
            });
        };
    }

    render() {
        const {availableSettings, uploadStateChange} = this;
        const {namings} = UploadStateNotification;

        const buttons = [];
        for (let i = 0; i < uploadStateChange.length; i++) {
            const key = uploadStateChange[i];
            const name = namings.find(v => v[0] === key)?.[1];

            if (name) {
                buttons.push(
                    <div className={styles.container}>
                        <DropDown items={[
                            [key, name],
                            ...availableSettings
                        ]} onSelect={this.replaceState(i)}/>
                        <button onClick={this.unwatchState(key)}>
                            <bc-icon name="delete"/>
                        </button>
                    </div>
                );
            }
        }

        if (availableSettings.length) {
            buttons.push(
                <DropDown items={[
                    ['add', 'Add another notification...'],
                    ...availableSettings
                ]} onSelect={this.watchState}/>
            );
        }

        return buttons;
    }
}
