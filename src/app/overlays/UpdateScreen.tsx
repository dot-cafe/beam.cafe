import {h}    from 'preact';
import styles from './UpdateScreen.module.scss';

export const UpdateScreen = () => {
    const prevBuild = localStorage.getItem('pb');
    const curBuild = String(env.BUILD_DATE);
    let updated = false;

    localStorage.setItem('pb', curBuild);
    if (prevBuild !== null && prevBuild !== curBuild) {
        updated = true;
    }

    return updated ? (
        <div className={styles.loadingScreen}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 411 411">
                <circle fill="#0A5DFF" cx="205.5" cy="205.5" r="205.5"/>
                <path fill="#FFFFFF"
                      d="M296.34,131.53c0.85-6.18-3.96-11.69-10.21-11.69H124.68c-6.27,0-11.08,5.56-10.17,11.77l22.08,150.9c1.32,13.23,13.23,22.48,26.46,22.48H249c13.23,0,23.82-9.25,26.46-22.48L296.34,131.53z"/>
            </svg>
        </div>
    ) : <div/>;
};
