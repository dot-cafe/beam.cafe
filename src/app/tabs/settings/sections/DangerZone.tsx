import {Component, h}                     from 'preact';
import {files, settings, socket, uploads} from '../../../../state';
import {bind, cn}                         from '../../../../utils/preact-utils';
import {Toast}                            from '../../../overlays/Toast';
import baseStyles                         from './_base.module.scss';

export class DangerZone extends Component {

    @bind
    resetSettings() {
        settings.reset();
        Toast.instance.show('Settings restored!');
    }

    @bind
    resetKeys() {

        // Cancel downloads
        uploads.massAction('cancel');

        // Request a new key-set
        socket.request('reset-keys').then(() => {
            Toast.instance.show('Keys refreshed!');
        }).catch(() => {
            Toast.instance.show({
                text: 'Failed to reset keys.',
                type: 'error'
            });
        });
    }

    render() {
        return (
            <div className={cn(baseStyles.section)}>
                <header>
                    <bc-icon name="electricity"/>
                    <h1>Danger Zone</h1>
                    <span> - Usage of the following options with caution!</span>
                </header>

                <section>
                    <header>
                        <bc-icon name="refresh-shield"/>
                        <h3>Refresh Keys</h3>
                        <button onClick={this.resetKeys}
                                className={baseStyles.danger}
                                disabled={files.isEmpty}>Refresh
                        </button>
                    </header>

                    <article>
                        In case you discover anomalies such as suspicious downloads you can
                        generate new keys for all your files. All active downloads will be cancelled
                        and your previous download-links will be invalidated.
                    </article>
                </section>

                <section>
                    <header>
                        <bc-icon name="settings"/>
                        <h3>Reset Settings</h3>
                        <button className={baseStyles.danger}
                                onClick={this.resetSettings}>Reset
                        </button>
                    </header>

                    <article>
                        This will restore the default-settings, overriding the current ones.
                    </article>
                </section>
            </div>
        );
    }
}
