import {Component, h} from 'preact';
import {bind, cn}     from '../../utils/preact-utils';
import styles         from './Checkbox.module.scss';

type Props = {
    checked: boolean;
    onChange: (state: boolean) => void;
};

type State = {};

export class Checkbox extends Component<Props, State> {

    @bind
    click() {
        this.props.onChange(!this.props.checked);
    }

    render({checked}: Props) {
        return (
            <button onClick={this.click}
                    className={cn(styles.checkbox, {
                        [styles.checked]: checked
                    })}>
                <svg xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 50 50">
                    <path d="M7,25L17.571,38,44,12"/>
                </svg>
            </button>
        );
    }
}
