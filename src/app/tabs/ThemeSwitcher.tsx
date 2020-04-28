import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import {settings}     from '../../state';
import {bind, cn}     from '../../utils/preact-utils';
import Icon           from '../components/Icon';
import styles         from './ThemeSwitcher.module.scss';

@observer
export class ThemeSwitcher extends Component<{}, {}> {

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
                <div>
                    <Icon name="sun"
                          className={cn({
                              [styles.visible]: theme === 'light'
                          })}/>

                    <Icon name="moon"
                          className={cn({
                              [styles.visible]: theme === 'dark'
                          })}/>
                </div>
            </div>
        );
    }
}
