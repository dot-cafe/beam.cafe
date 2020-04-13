import {Component, h} from 'preact';
import styles         from './App.module.scss';
import {DropZone}     from './overlays/DropZone';
import {Tabs}         from './tabs/Tabs';

export class App extends Component {
    render() {
        return (
            <div className={styles.app}>
                <Tabs/>
                <DropZone/>
            </div>
        );
    }
}
