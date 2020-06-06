import {cn}                     from '@utils/preact-utils';
import {FunctionalComponent, h} from 'preact';
import baseStyles               from './_base.module.scss';
import styles                   from './About.module.scss';

export const About: FunctionalComponent = () => (
    <div className={cn(baseStyles.section, styles.about)}
         role="comment">
        <header>
            <bc-icon name="help"/>
            <h1>About</h1>
            <span>About the Author and the project</span>
        </header>

        <section>
            <ul>
                <li>Creator: <b>Simon Reinisch</b></li>
                <li>Project: <a href="https://github.com/dot-cafe/beam.cafe"
                                target="_blank"
                                rel="noopener noreferrer">Repository on GitHub</a></li>
                <li>License: <b>MIT</b></li>
                <li>Version: <b>{env.VERSION}</b></li>
                <li>Build: <b>{new Date(env.BUILD_DATE).toUTCString()}</b></li>
            </ul>
        </section>

        <section>
            <p>Many thanks to <a href="https://icons8.com/"
                                 target="_blank"
                                 rel="noopener noreferrer">Icons8</a> for the Icons!</p>
        </section>
    </div>
);
