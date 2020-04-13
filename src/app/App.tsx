import {Component, h} from 'preact';
import styles         from './App.module.scss';
import {DropZone}     from './DropZone';
import {FileList}     from './FileList';

export class App extends Component {
    render() {
        return (
            <div className={styles.app}>
                <FileList/>
                <DropZone/>
            </div>
        );
    }
}
