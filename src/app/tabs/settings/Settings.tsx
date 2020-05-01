import {Component, h} from 'preact';
import {bind, cn}     from '../../../utils/preact-utils';
import Icon           from '../../components/Icon';
import Footer         from './Footer';
import {Security}     from './sections/Security';
import styles         from './Settings.module.scss';

type Props = {};
type State = {
    tab: string;
    menuOpen: boolean;
};

// TODO: This whole thing is overly complex, simplify it!
export class Settings extends Component<Props, State> {
    private static readonly TABS = [
        {
            key: 'security',
            name: 'Security',
            icon: 'shield'
        }
    ];

    readonly state = {
        tab: 'security',
        menuOpen: true
    };

    changeTab(newTab: string) {
        return () => {
            this.setState({
                tab: newTab,
                menuOpen: false
            });
        };
    }

    @bind
    showMenu() {
        this.setState({
            menuOpen: true
        });
    }

    render() {
        const {tab, menuOpen} = this.state;

        const tabButtons = Settings.TABS.map((data, index) => {
            const {key, name, icon} = data;

            return (
                <button onClick={this.changeTab(key)}
                        key={index}
                        className={cn({
                            [styles.active]: key === tab
                        })}>
                    <Icon name={icon}/>
                    <span>{name}</span>
                </button>
            );
        });

        return (
            <div className={styles.settings}>
                <div className={styles.options}>
                    <div className={cn(styles.tabs, {
                        [styles.visible]: menuOpen
                    })}>
                        {tabButtons}
                    </div>

                    <div className={cn(styles.content, {
                        [styles.visible]: !menuOpen
                    })}>
                        <div><Security/></div>
                    </div>

                    <button onClick={this.showMenu}>
                        <Icon name="back-arrow"/>
                        <span>Back</span>
                    </button>
                </div>

                <Footer/>
            </div>
        );
    }
}
