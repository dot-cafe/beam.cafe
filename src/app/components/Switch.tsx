import {Component, h} from 'preact';
import {bind, cn}     from '../../utils/preact-utils';
import styles         from './Switch.module.scss';

type Props = {
    onChange: (newState: boolean) => void;
    selected: SwitchState;
};

type State = {};

export type SwitchState = boolean | 'on' | 'off' | 'intermediate';

export class Switch extends Component<Props, State> {

    @bind
    onChange() {
        this.props.onChange(!this.props.selected);
    }

    render() {
        const {selected} = this.props;

        const state = typeof selected === 'boolean' ?
            selected ? 'on' : 'off' : selected;

        return <div className={styles.switch}
                    data-state={state}
                    onClick={this.onChange}/>;
    }
}
