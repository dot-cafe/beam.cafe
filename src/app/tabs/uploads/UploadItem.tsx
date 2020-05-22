import {Checkbox}         from '@components/Checkbox';
import {Upload}           from '@state/models/Upload';
import {UploadExtensions} from '@state/models/UploadExtensions';
import {uploads}          from '@state/stores/Uploads';
import {bind, cn}         from '@utils/preact-utils';
import {observer}         from 'mobx-react';
import {Component, h}     from 'preact';
import styles             from './UploadItem.module.scss';

type Props = {
    item: Upload;
    selected: boolean;
    onSelect: (item: Upload, ev: MouseEvent) => void;
};

type State = {};

@observer
export class UploadItem extends Component<Props, State> {

    @bind
    togglePause(): void {
        const {item} = this.props;

        if (item.simpleState === 'pending') {
            item.update('running');
        } else if (item.simpleState === 'active') {
            item.update('paused');
        }
    }

    @bind
    remove(): void {
        const {item} = this.props;

        if (item.simpleState === 'done') {
            uploads.remove(item.id);
        }
    }

    @bind
    cancel(): void {
        const {item} = this.props;

        if (item.simpleState === 'active' ||
            item.simpleState === 'pending') {
            item.update('cancelled');
        }
    }

    @bind
    toggleSelect(_: boolean, ev: MouseEvent) {
        const {onSelect, item} = this.props;
        onSelect(item, ev);
    }

    render() {
        const {item, selected} = this.props;
        const {state, progress} = item;

        // Styling information
        const percentage = Math.round(progress * 10000) / 100;
        const progressBarStyle = `--progress: ${percentage}%;` +
            `--text-clip-left: ${percentage}%;` +
            `--text-clip-right: ${100 - percentage}%;`;

        const statusIcon = UploadExtensions.getStatusIconFor(state);
        const statusMessage = UploadExtensions.getStatusMessageFor(item);
        const toolTipNote = (() => {
            switch (item.state) {
                case 'awaiting-approval':
                    return 'Approve';
                case 'paused':
                    return 'Continue';
                case 'running':
                    return 'Pause';
            }

            return '';
        })();

        return (
            <div className={styles.upload}
                 data-state={state}>

                <Checkbox checked={selected}
                          onChange={this.toggleSelect}/>

                <div className={styles.progressBar}
                     style={progressBarStyle}>
                    <p><span>{statusMessage}</span></p>
                    <p><span>{statusMessage}</span></p>
                </div>

                <button onClick={this.togglePause}
                        className={cn(styles.btn, styles.pauseBtn)}>
                    <bc-tooltip content={toolTipNote}/>
                    {statusIcon}
                </button>

                {item.simpleState === 'done' ?
                    <button onClick={this.remove}
                            className={cn(styles.btn, styles.removeBtn)}>
                        <bc-tooltip content="Remove"/>
                        <bc-icon name="trash"/>
                    </button> :
                    <button onClick={this.cancel}
                            className={cn(styles.btn, styles.abortBtn)}>
                        <bc-tooltip content="Cancel Upload"/>
                        <bc-icon name="delete"/>
                    </button>
                }
            </div>
        );
    }
}
