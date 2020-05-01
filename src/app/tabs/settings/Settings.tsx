import {Component, createRef, h} from 'preact';
import {cn}                      from '../../../utils/preact-utils';
import {CollapsibleList}         from '../../components/CollapsibleList';
import Icon                      from '../../components/Icon';
import {About}                   from './sections/About';
import {Security}                from './sections/Security';
import styles                    from './Settings.module.scss';

type Props = {};
type State = {
    tab: string;
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

// TODO: Clean up, still messy.
export class Settings extends Component<Props, State> {
    private readonly mobileMenu = createRef<CollapsibleList>();

    readonly state = {
        tab: 'about'
    };

    changeTab(newTab: string) {
        return () => {
            this.mobileMenu.current?.toggleRetract();
            this.setState({
                tab: newTab
            });
        };
    }

    render() {
        const {tab} = this.state;
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
                        className={cn(styles.tabButton, {
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
                    <div className={styles.tabs}>
                        {tabButtons}
                    </div>

                    <div className={styles.content}>
                        <div>{activeComponent}</div>
                    </div>

                    <div className={styles.mobileMenu}>
                        <CollapsibleList ref={this.mobileMenu} header={open =>
                            <button className={cn(styles.toggleButton, {
                                [styles.open]: open
                            })}>
                                <div>
                                    <div/>
                                    <div/>
                                    <div/>
                                </div>
                            </button>
                        } content={<div className={styles.mobileList}>{tabButtons}</div>}/>
                    </div>
                </div>
            </div>
        );
    }
}
