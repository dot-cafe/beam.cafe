import {Component, h} from 'preact';
import Footer         from './Footer';
import styles         from './Settings.module.scss';

export class Settings extends Component {
    render() {
        return (
            <div className={styles.settings}>
                <span>Coming soon.</span>
                <Footer/>
            </div>
        );
    }
}
