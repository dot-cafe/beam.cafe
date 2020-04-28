import {Component, h} from 'preact';
import Footer         from './Footer';
import {Options}      from './Options';
import styles         from './Settings.module.scss';

export class Settings extends Component {
    render() {
        return (
            <div className={styles.settings}>
                <Options/>
                <Footer/>
            </div>
        );
    }
}
