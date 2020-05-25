import {Switch}       from '@components/Switch';
import {settings}     from '@state/index';
import {bind}         from '@utils/preact-utils';
import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import baseStyles     from './_base.module.scss';

@observer
export class Appearance extends Component {

    constructor() {
        super();

        if (settings.get('highContrast')) {
            document.body.classList.add('high-contrast');
        }
    }

    @bind
    toggleHighContrast(newValue: boolean) {
        document.body.classList[newValue ? 'add' : 'remove']('high-contrast');
        settings.set('highContrast', newValue);
    }

    render() {
        return (
            <div className={baseStyles.section}>
                <header>
                    <bc-icon name="palette"/>
                    <h1>Appearance</h1>
                    <span>Make it your own!</span>
                </header>

                <section>
                    <header>
                        <bc-icon name="contrast"/>
                        <h3>High Contrast</h3>
                        <Switch state={settings.get('highContrast')}
                                onChange={this.toggleHighContrast}/>
                    </header>

                    <article>
                        Increases the contrast of all UI-Elements.
                    </article>
                </section>
            </div>
        );
    }
}
