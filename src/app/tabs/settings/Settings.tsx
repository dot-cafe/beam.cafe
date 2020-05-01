import {Component, h} from 'preact';
import {bind, cn}     from '../../../utils/preact-utils';
import Icon           from '../../components/Icon';
import {About}        from './sections/About';
import {Security}     from './sections/Security';
import styles         from './Settings.module.scss';

type Props = {};
type State = {
    tab: string;
    menuOpen: boolean;
};

const tabs = [
    {
        key: 'security',
        name: 'Security',
        icon: 'shield',
        com: <Security/>
    },
    {
        key: 'about',
        name: 'About',
        icon: 'help',
        com: <About/>
    }
];

// TODO: This whole thing is overly complex, simplify it!
export class Settings extends Component<Props, State> {
    readonly state = {
        tab: 'about',
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
        let activeComponent = null;
        const tabButtons = [];

        for (let i = 0; i < tabs.length; i++) {
            const {key, name, icon, com} = tabs[i];
            const active = key === tab;

            if (active) {
                activeComponent = com;
            }

            tabButtons.push(
                <button onClick={this.changeTab(key)}
                        key={i}
                        className={cn({
                            [styles.active]: active
                        })}>
                    <Icon name={icon}/>
                    <span>{name}</span>
                </button>
            );
        }

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
                        <div>{activeComponent}</div>
                    </div>

                    <button onClick={this.showMenu}>
                        <Icon name="back-arrow"/>
                        <span>Back</span>
                    </button>
                </div>
            </div>
        );
    }
}
