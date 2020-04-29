import {observer}         from 'mobx-react';
import {Component, h}     from 'preact';
import {settings, socket} from '../../../state';
import {bind}             from '../../../utils/preact-utils';
import {Switch}           from '../../components/Switch';
import styles             from './Options.module.scss';

@observer
export class Options extends Component<{}, {}> {

    @bind
    toggleAutoPause(newValue: boolean): void {
        settings.set('autoPause', newValue);
    }

    @bind
    toggleStrictSession(newValue: boolean): void {
        settings.set('strictSession', newValue);
    }

    render() {
        return (
            <div className={styles.options}>
                <section>
                    <header>
                        <h3>Auto Pause</h3>
                        <Switch selected={settings.get('autoPause')}
                                onChange={this.toggleAutoPause}/>
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
                        <h3>Strict Session</h3>
                        <Switch selected={settings.get('strictSession')}
                                onChange={this.toggleStrictSession}/>
                    </header>

                    <article>
                        Normally all keys and information about your files will be kept
                        at least 15 minutes after disconnecting to re-establish ongoing uploads.
                        Activate this if your ethernet-connection is stable and you want your session
                        destroyed if you close this application.
                    </article>

                </section>
            </div>
        );
    }
}
