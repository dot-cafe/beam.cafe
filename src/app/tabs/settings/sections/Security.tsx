import {Switch}                 from '@components/Switch';
import {settings}               from '@state/index';
import {uids}                   from '@utils/uid';
import {observer}               from 'mobx-react';
import {FunctionalComponent, h} from 'preact';
import baseStyles               from './_base.module.scss';

export const Security: FunctionalComponent = observer(() => {
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
                    <Switch state={settings.autoPause}
                            onChange={v => settings.autoPause = v}
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
                    <Switch state={settings.remote.strictSession}
                            onChange={v => settings.remote.strictSession = v}
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
                    <Switch state={settings.remote.reusableDownloadKeys}
                            onChange={v => settings.remote.reusableDownloadKeys = v}
                            aria-describedby={label3}/>
                </header>

                <article id={label3}>
                    Turn this option off to make all download links single-use.
                    After a download-link has been used the file will refresh and a you&apos;ll
                    receive a new download link.
                </article>
            </section>

            <section>
                <header>
                    <bc-icon name="online"/>
                    <h3>Streaming</h3>
                    <Switch state={settings.remote.allowStreaming}
                            onChange={v => settings.remote.allowStreaming = v}
                            aria-describedby={label3}/>
                </header>

                <article id={label3}>
                    Streaming allows your peers to request partial content of a file (e.g. streaming a video / audio file.)
                    Disable this to force your peer to download the whole file.
                </article>
            </section>
        </div>
    );
});
