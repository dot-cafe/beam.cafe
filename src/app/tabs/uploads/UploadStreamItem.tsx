import {Checkbox}                        from '@components/Checkbox';
import {UploadExtensions}                from '@state/models/UploadExtensions';
import {UploadStream, UploadStreamState} from '@state/models/UploadStream';
import {uploads}                         from '@state/stores/Uploads';
import {bind, cn}                        from '@utils/preact-utils';
import {observer}                        from 'mobx-react';
import {Component, h}                    from 'preact';
import {isMobile}                        from '../../browserenv';
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
    remove(): void {
        const {item} = this.props;

        if (item.simpleState === 'done') {
            uploads.remove(item.id);
        }
    }

    @bind
    toggleSelect(_: boolean, ev: MouseEvent) {
        const {onSelect, item} = this.props;
        onSelect(item, ev);
    }

    render() {
        const {item, selected} = this.props;
        const {state} = item;

        return (
            <div className={styles.uploadStream}
                 data-state={state}
                 role="listitem">

                {!isMobile && <Checkbox checked={selected}
                                        onChange={this.toggleSelect}
                                        aria-label="Select stream"/>}

                <div className={styles.progressBar}
                     aria-label="Active uploads">
                    <p><span>{UploadExtensions.getStatusMessageFor(item)}</span></p>
                </div>

                {
                    item.simpleState === 'done' ? '' :
                        state === 'awaiting-approval' ?
                            <button onClick={this.updateState('running')}
                                    className={cn(styles.btn, styles.primaryBtn)}
                                    aria-label="Approve stream">
                                <bc-tooltip content="Approve stream"/>
                                <bc-icon name="thumbs-up"/>
                            </button> :
                            <button onClick={this.updateState(state === 'paused' ? 'running' : 'paused')}
                                    className={cn(styles.btn, styles.yellowBtn)}
                                    aria-label={state === 'paused' ? 'Continue stream' : 'Pause stream'}>
                                <bc-tooltip content={state === 'paused' ? 'Continue stream' : 'Pause stream'}/>
                                <bc-icon name={state === 'paused' ? 'play' : 'pause'}/>
                            </button>
                }

                {item.simpleState === 'done' ?
                    <button onClick={this.remove}
                            className={cn(styles.btn, styles.primaryBtn)}
                            aria-label="Remove stream">
                        <bc-tooltip content="Remove"/>
                        <bc-icon name="trash"/>
                    </button> :
                    <button onClick={this.updateState('cancelled')}
                            className={cn(styles.btn, styles.redBtn)}
                            aria-label="Cancel stream">
                        <bc-tooltip content="Cancel stream"/>
                        <bc-icon name="delete"/>
                    </button>
                }
            </div>
        );
    }
}
