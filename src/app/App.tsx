import {Component, h} from 'preact';
import {UpdateScreen} from './overlays/UpdateScreen';
import {Toast}        from './overlays/Toast';
import {Tabs}         from './tabs/Tabs';
import styles         from './App.module.scss';

export class App extends Component {
    render() {
        return (
            <div className={styles.app}>
                {Toast.getElement()}
                <UpdateScreen/>
                <Tabs/>
            </div>
        );
    }
}
