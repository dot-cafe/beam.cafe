import {Component, h} from 'preact';
import {UpdateScreen} from './overlays/UpdateScreen';
import {Toast}        from './overlays/Toast';
import {StatusBar} from './StatusBar';
import {Tabs}      from './tabs/container/Tabs';
import styles      from './App.module.scss';

export class App extends Component {
    render() {
        return (
            <div className={styles.app}>
                {Toast.getElement()}
                <UpdateScreen/>
                <StatusBar/>
                <Tabs/>
            </div>
        );
    }
}
