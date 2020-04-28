import {h}    from 'preact';
import styles from './Footer.module.scss';

export default () => (
    <div className={styles.footer}>
        <article>
            <span>MIT 2020 by <b>Simon Reinisch</b></span>
            <span/>
            <span>Version: <b>{env.VERSION === '0.0.0' ? 'Unreleased' : env.VERSION}</b></span>
            <span/>
            <span>Build: <b>{new Date(env.BUILD_DATE).toUTCString()}</b></span>
        </article>
    </div>
);
