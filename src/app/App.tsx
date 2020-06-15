import {DialogBox}              from '@overlays/DialogBox';
import {Toast}                  from '@overlays/Toast';
import {UpdateScreen}           from '@overlays/UpdateScreen';
import {FunctionalComponent, h} from 'preact';
import styles                   from './App.module.scss';
import {StatusBar}              from './StatusBar';
import {Tabs}                   from './tabs/container/Tabs';

export const App: FunctionalComponent = () => (
    <div className={styles.app}
         role="application">
        {DialogBox.element}
        {Toast.element}
        <UpdateScreen/>
        <StatusBar/>
        <Tabs/>
    </div>
);
