import {Switch}                 from '@components/Switch';
import {settings}               from '@state/index';
import {observer}               from 'mobx-react';
import {FunctionalComponent, h} from 'preact';
import {useEffect}              from 'preact/hooks';
import baseStyles               from './_base.module.scss';

export const Appearance: FunctionalComponent = observer(() => {
    useEffect(() => {
        if (settings.highContrast) {
            document.body.classList.add('high-contrast');
        }
    });

    const toggleHighContrast = (newValue: boolean) => {
        document.body.classList[newValue ? 'add' : 'remove']('high-contrast');
        settings.highContrast = newValue;
    };

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
                    <Switch state={settings.highContrast}
                            onChange={toggleHighContrast}/>
                </header>

                <article>
                    Increases the contrast of all UI-Elements.
                </article>
            </section>
        </div>
    );
});
