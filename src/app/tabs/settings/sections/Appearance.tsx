import {Switch}                 from '@components/Switch';
import {Toast}                  from '@overlays/Toast';
import {settings}               from '@state/index';
import {observer}               from 'mobx-react';
import {FunctionalComponent, h} from 'preact';
import baseStyles               from './_base.module.scss';
import styles                   from './Appearance.module.scss';

export const Appearance: FunctionalComponent = observer(() => {
    const toggleHighContrast = (newValue: boolean) => {
        document.body.classList[newValue ? 'add' : 'remove']('high-contrast');
        settings.highContrast = newValue;
    };

    const generateThemeColors = (hue: number, saturation: number, lightness: number) => {
        return [
            `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            `hsl(${hue}, ${saturation - 12}%, ${lightness - 6}%)`,
            `hsla(${hue}, ${saturation - 12}%, ${lightness - 6}%, 0.42)`
        ];
    };

    const applyCustomColor = (hue: number, saturation: number, lightness: number) => {
        if (settings.highContrast) {
            Toast.instance.show({
                text: 'Turn of high contrast to use custom colors!',
                type: 'success'
            });
        } else {
            settings.themeColor = [hue, saturation, lightness];
        }
    };

    const bodyStyle = document.body.style;
    if (settings.highContrast) {
        document.body.classList.add('high-contrast');
        bodyStyle.removeProperty('--c-primary');
        bodyStyle.removeProperty('--c-primary-accent');
        bodyStyle.removeProperty('--c-focus-border-primary');
    } else {
        const [color, accent, focus] = generateThemeColors(...settings.themeColor);
        bodyStyle.setProperty('--c-primary', color);
        bodyStyle.setProperty('--c-primary-accent', accent);
        bodyStyle.setProperty('--c-focus-border-primary', focus);
    }

    const customColorButtons = [];
    const colors: Array<Array<number>> = [
        [50, 92, 45],
        [90, 86, 42],
        [160, 79, 45],
        [220, 94, 61],
        [260, 94, 61],
        [300, 79, 54],
        [360, 75, 56]
    ];

    for (const [hue, cs, cl] of colors) {
        const [color, accent, focus] = generateThemeColors(hue, cs, cl);

        customColorButtons.push(
            <button style={`--c-color:${color};--c-accent:${accent};--c-focus:${focus};`}
                    onClick={() => applyCustomColor(hue, cs, cl)}/>
        );
    }

    return (
        <div className={baseStyles.section}>
            <header>
                <bc-icon name="palette"/>
                <h1>Appearance</h1>
                <span>Make it your own!</span>

                <div className={styles.colors}>
                    {customColorButtons}
                </div>
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
