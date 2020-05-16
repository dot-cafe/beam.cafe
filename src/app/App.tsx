import {FunctionalComponent, h} from 'preact';
import {DialogBox}              from './overlays/DialogBox';
import {UpdateScreen}           from './overlays/UpdateScreen';
import {Toast}                  from './overlays/Toast';
import {StatusBar}              from './StatusBar';
import {Tabs}                   from './tabs/container/Tabs';
import styles                   from './App.module.scss';

export const App: FunctionalComponent = () => (
    <div className={styles.app}>
        {DialogBox.element}
        {Toast.element}
        <UpdateScreen/>
        <StatusBar/>
        <Tabs/>

        {/* TODO: Remove with first, stable release */}
        <p>WIP</p>
    </div>
);
