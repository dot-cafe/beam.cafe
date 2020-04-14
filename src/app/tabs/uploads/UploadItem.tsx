import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import {Upload}       from '../../../state/models/Uploads';
import styles         from './UploadItem.module.scss';

type Props = {
    upload: Upload;
};

type State = {};

@observer
export class UploadItem extends Component<Props, State> {

    render() {
        const {upload} = this.props;
        const percentage = Math.round(upload.progress * 10000) / 100;

        return (
            <div className={styles.upload}>
                <div>
                    <p>{upload.listedFile.file.name}</p>
                    <span>{percentage}%</span>
                </div>
            </div>
        );
    }
}
