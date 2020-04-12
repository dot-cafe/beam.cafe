import {Component, h} from 'preact';
import styles         from './App.module.scss';

export class App extends Component {
    render() {
        return (
            <div class={styles.app}>
                Hello
            </div>
        );
    }
}
