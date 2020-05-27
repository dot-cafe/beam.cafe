import {Checkbox}     from '@components/Checkbox';
import {UploadStream} from '@state/models/UploadStream';
import {bind, cn}     from '@utils/preact-utils';
import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import styles         from './UploadStreamItem.module.scss';

type Props = {
    item: UploadStream;
    selected: boolean;
    onSelect: (item: UploadStream, ev: MouseEvent) => void;
};

@observer
export class UploadStreamItem extends Component<Props> {

    @bind
    togglePause(): void {
        const {item} = this.props;
    }

    @bind
    remove(): void {
        const {item} = this.props;
    }

    @bind
    cancel(): void {
        const {item} = this.props;
    }

    @bind
    toggleSelect(_: boolean, ev: MouseEvent) {
        const {onSelect, item} = this.props;
        onSelect(item, ev);
    }

    render() {
        const {item, selected} = this.props;
        const {state, activeUploads} = item;

        return (
            <div className={styles.uploadStream}
                 data-state={state}
                 role="listitem">

                <Checkbox checked={selected}
                          onChange={this.toggleSelect}
                          aria-label="Select stream"/>

                <div className={styles.progressBar}
                     aria-label="Active uploads">
                    <p><span>{activeUploads} uploads active.</span></p>
                </div>

                <button onClick={this.remove}
                        className={cn(styles.btn, styles.stop)}
                        aria-label="Cancel stream">
                    <bc-tooltip content="Remove"/>
                    <bc-icon name="stop"/>
                </button>
            </div>
        );
    }
}
