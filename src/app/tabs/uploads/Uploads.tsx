import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import {uploads}      from '../../../state';
import {UploadItem}   from './UploadItem';
import styles         from './Uploads.module.scss';

@observer
export class Uploads extends Component {
    render() {
        const {items} = uploads;

        return (
            <div className={styles.uploads}>
                {items.map((value, i) =>
                    <UploadItem key={i} upload={value}/>
                )}
            </div>
        );
    }
}
