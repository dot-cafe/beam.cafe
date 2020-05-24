import {Switch}                      from '@components/Switch';
import {AvailableSettings, settings} from '@state/index';
import {uids}                        from '@utils/uid';
import {observer}                    from 'mobx-react';
import {Component, h}                from 'preact';
import baseStyles                    from './_base.module.scss';

@observer
export class Security extends Component {

    option(key: keyof AvailableSettings) {
        return (newValue: boolean) => {
            settings.set(key, newValue);
        };
    }

    render() {
        const [label1, label2, label3] = uids(3);

        return (
            <div className={baseStyles.section}>
                <header>
                    <bc-icon name="shield"/>
                    <h1>Security</h1>
                    <span>Everything around privacy and more</span>
                </header>

                <section>
                    <header>
                        <bc-icon name="resume"/>
                        <h3>Auto Pause</h3>
                        <Switch state={settings.get('autoPause')}
                                onChange={this.option('autoPause')}
                                aria-describedby={label1}/>
                    </header>

                    <article id={label1}>
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
                        <Switch state={settings.get('strictSession')}
                                onChange={this.option('strictSession')}
                                aria-describedby={label2}/>
                    </header>

                    <article id={label2}>
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
                        <Switch state={settings.get('reusableDownloadKeys')}
                                onChange={this.option('reusableDownloadKeys')}
                                aria-describedby={label3}/>
                    </header>

                    <article id={label3}>
                        Turn this option off to make all download links single-use.
                        After a download-link has been used the file will refresh and a you&apos;ll
                        receive a new download link.
                    </article>
                </section>
            </div>
        );
    }
}
