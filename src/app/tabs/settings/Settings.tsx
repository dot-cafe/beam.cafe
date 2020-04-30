import {Component, h} from 'preact';
import Footer         from './Footer';
import {Security}     from './sections/Security';
import styles         from './Settings.module.scss';

export class Settings extends Component {
    render() {
        return (
            <div className={styles.settings}>
                <div className={styles.options}>
                    <Security/>
                </div>

                <Footer/>
            </div>
        );
    }
}
