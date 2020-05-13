import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import {settings}     from '../../../state';
import {bind, cn}     from '../../../utils/preact-utils';
import styles         from './ThemeSwitcher.module.scss';

@observer
export class ThemeSwitcher extends Component {

    constructor() {
        super();
        this.setTheme(settings.get('theme'));
    }

    setTheme(theme: 'light' | 'dark') {
        const oldTheme = settings.get('theme');
        const {classList} = document.body;

        classList.remove(oldTheme);
        classList.add(theme, 'theme-transition');

        // Wait until theme-transition duration is finish
        setTimeout(() => {
            classList.remove('theme-transition');
        }, 300);

        // Update settings
        settings.set('theme', theme);
    }

    @bind
    toggleTheme() {
        const theme = settings.get('theme');
        this.setTheme(theme === 'light' ? 'dark' : 'light');
    }

    render() {
        const theme = settings.get('theme');

        return (
            <div onClick={this.toggleTheme}
                 className={cn(styles.themeSwitcher, {
                     [styles.toggled]: theme === 'dark'
                 })}>

                <bc-tooltip content={`Change theme to ${theme}`}/>

                <button>
                    <bc-icon name="sun"
                             className={cn({
                                 [styles.visible]: theme === 'light'
                             })}/>

                    <bc-icon name="moon"
                             className={cn({
                                 [styles.visible]: theme === 'dark'
                             })}/>
                </button>
            </div>
        );
    }
}
