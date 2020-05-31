import {cn}                                from '@utils/preact-utils';
import {createRef, FunctionalComponent, h} from 'preact';
import {useEffect}                         from 'preact/hooks';
import styles                              from './Checkbox.module.scss';

type Props = {
    'aria-label'?: string;
    className?: string;
    checked: boolean;
    onChange: (state: boolean, ev: MouseEvent) => void;
};

export const Checkbox: FunctionalComponent<Props> = (
    {
        checked,
        onChange,
        className = '',
        ...props
    }
) => {
    const btn = createRef<HTMLButtonElement>();
    let lastState = checked;

    useEffect(() => {
        if (checked && lastState) {
            btn.current?.focus();
        }

        lastState = checked;
    });

    return (
        <button role="checkbox"
                ref={btn}
                aria-label={props['aria-label']}
                onClick={(ev: MouseEvent) => onChange(!checked, ev)}
                className={cn(styles.checkbox, className, {
                    [styles.checked]: checked
                })}>
            <svg xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 50 50">
                <path d="M7,25L17.571,38,44,12"/>
            </svg>
        </button>
    );
};
