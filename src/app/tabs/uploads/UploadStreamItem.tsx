import {Checkbox}                        from '@components/Checkbox';
import {UploadStream, UploadStreamState} from '@state/models/UploadStream';
import {bind, cn}                        from '@utils/preact-utils';
import {observer}                        from 'mobx-react';
import {Component, h}                    from 'preact';
import prettyBytes                       from 'pretty-bytes';
import styles                            from './UploadStreamItem.module.scss';

type Props = {
    item: UploadStream;
    selected: boolean;
    onSelect: (item: UploadStream, ev: MouseEvent) => void;
};

@observer
export class UploadStreamItem extends Component<Props> {

    @bind
    updateState(state: UploadStreamState) {
        return () => this.props.item.update(state);
    }

    @bind
    toggleSelect(_: boolean, ev: MouseEvent) {
        const {onSelect, item} = this.props;
        onSelect(item, ev);
    }

    render() {
        const {item, selected} = this.props;
        const {state, progress} = item;
        const transferred = progress ? `${prettyBytes(progress)} transferred` : 'Pending Stream...';

        return (
            <div className={styles.uploadStream}
                 data-state={state}
                 role="listitem">

                <Checkbox checked={selected}
                          onChange={this.toggleSelect}
                          aria-label="Select stream"/>

                <div className={styles.progressBar}
                     aria-label="Active uploads">
                    <p><span>{transferred}</span></p>
                </div>

                {
                    state === 'awaiting-approval' ?
                        <button onClick={this.updateState('running')}
                                className={cn(styles.btn, styles.approveBtn)}
                                aria-label="Approve stream">
                            <bc-tooltip content="Approve stream"/>
                            <bc-icon name="thumbs-up"/>
                        </button> :
                        <button onClick={this.updateState(state === 'paused' ? 'running' : 'paused')}
                                className={cn(styles.btn, styles.pauseBtn)}
                                aria-label={state === 'paused' ? 'Continue stream' : 'Pause stream'}>
                            <bc-tooltip content={state === 'paused' ? 'Continue stream' : 'Pause stream'}/>
                            <bc-icon name={state === 'paused' ? 'play' : 'pause'}/>
                        </button>
                }

                <button onClick={this.updateState('cancelled')}
                        className={cn(styles.btn, styles.stopBtn)}
                        aria-label="Cancel stream">
                    <bc-tooltip content="Remove"/>
                    <bc-icon name="stop"/>
                </button>
            </div>
        );
    }
}
