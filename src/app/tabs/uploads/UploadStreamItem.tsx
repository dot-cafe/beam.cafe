import {Checkbox}     from '@components/Checkbox';
import {UploadStream} from '@state/models/UploadStream';
import {uploads}      from '@state/stores/Uploads';
import {bind, cn}     from '@utils/preact-utils';
import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import prettyBytes    from 'pretty-bytes';
import styles         from './UploadStreamItem.module.scss';

type Props = {
    item: UploadStream;
    selected: boolean;
    onSelect: (item: UploadStream, ev: MouseEvent) => void;
};

@observer
export class UploadStreamItem extends Component<Props> {

    @bind
    cancel(): void {
        const {item} = this.props;
        uploads.remove(item.id);
        item.cancel();
    }

    @bind
    toggleSelect(_: boolean, ev: MouseEvent) {
        const {onSelect, item} = this.props;
        onSelect(item, ev);
    }

    render() {
        const {item, selected} = this.props;
        const {state, progress} = item;
        const transferred = `${prettyBytes(progress)} transferred`;

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

                <button onClick={this.cancel}
                        className={cn(styles.btn, styles.stop)}
                        aria-label="Cancel stream">
                    <bc-tooltip content="Remove"/>
                    <bc-icon name="stop"/>
                </button>
            </div>
        );
    }
}
