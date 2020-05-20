import {FunctionalComponent, h} from 'preact';
import {cn}                     from '@utils/preact-utils';
import styles                   from './Checkbox.module.scss';

type Props = {
    className?: string;
    checked: boolean;
    onChange: (state: boolean) => void;
};

export const Checkbox: FunctionalComponent<Props> = ({checked, onChange, className = ''}) => (
    <button onClick={() => onChange(!checked)}
            className={cn(styles.checkbox, className, {
                [styles.checked]: checked
            })}>
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 50 50">
            <path d="M7,25L17.571,38,44,12"/>
        </svg>
    </button>
);
