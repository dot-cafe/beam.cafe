import {observer}                                            from 'mobx-react';
import {Component, h}                                        from 'preact';
import {AvailableSettings, files, settings, socket, uploads} from '../../../../state';
import {bind}                                                from '../../../../utils/preact-utils';
import {Switch}                                              from '../../../components/Switch';
import {Toast}                                               from '../../../overlays/Toast';
import styles                                                from './_base.module.scss';

@observer
export class Security extends Component<{}, {}> {

    option(key: keyof AvailableSettings) {
        return (newValue: boolean) => {
            settings.set(key, newValue);
        };
    }

    @bind
    resetKeys() {

        // Cancel downloads
        uploads.massAction('cancel');

        // Request a new key-set
        socket.request('reset-keys').then(() => {
            Toast.instance.set({
                text: 'Keys refreshed!',
                type: 'success'
            });
        }).catch(() => {
            Toast.instance.set({
                text: 'Failed to reset keys.',
                type: 'error'
            });
        });
    }

    render() {
        return (
            <div className={styles.section}>
                <header>
                    <bc-icon name="shield"/>
                    <h1>Security</h1>
                    <span> - Everything around privacy and more</span>
                </header>

                <section>
                    <header>
                        <bc-icon name="resume"/>
                        <h3>Auto Pause</h3>
                        <Switch selected={settings.get('autoPause')}
                                onChange={this.option('autoPause')}/>
                    </header>

                    <article>
                        Every download / incoming request will be paused first until
                        you explicitly &quot;confirm&quot; the file to get downloaded.
                        This increases security by preventing others downloading your
                        file while you&apos;re AFK or without knowing.
                    </article>
                </section>

                <section>
                    <header>
                        <bc-icon name="ninja"/>
                        <h3>Strict Session</h3>
                        <Switch selected={settings.get('strictSession')}
                                onChange={this.option('strictSession')}/>
                    </header>

                    <article>
                        Normally all keys and information about your files will be kept
                        at least 15 minutes after disconnecting to re-establish ongoing uploads.
                        Activate this if your ethernet-connection is stable and you want your session
                        destroyed if you close this application.
                    </article>
                </section>

                <section>
                    <header>
                        <bc-icon name="recycle"/>
                        <h3>Reusable download-links</h3>
                        <Switch selected={settings.get('reusableDownloadKeys')}
                                onChange={this.option('reusableDownloadKeys')}/>
                    </header>

                    <article>
                        Turn this option off to make all download links single-use.
                        After a download-link has been used the file will refresh and a you&apos;ll
                        receive a new download link.
                    </article>
                </section>

                <section>
                    <header>
                        <bc-icon name="refresh-shield"/>
                        <h3>Restore Keys</h3>
                        <button onClick={this.resetKeys}
                                disabled={files.isEmpty}>Restore
                        </button>
                    </header>

                    <article>
                        In case you discover anomalies such as suspicious downloads you can
                        generate new keys for all your files. All active downloads will be cancelled
                        and your previous download-links will be invalidated.
                    </article>
                </section>
            </div>
        );
    }
}
