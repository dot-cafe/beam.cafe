import {Component, h} from 'preact';
import styles         from './App.module.scss';
import {DropZone}     from './overlays/DropZone';
import {Toast}        from './overlays/Toast';
import {Tabs}         from './tabs/Tabs';

export class App extends Component {
    render() {
        return (
            <div className={styles.app}>
                {Toast.getElement()}
                <Tabs/>
                <DropZone/>
            </div>
        );
    }
}
