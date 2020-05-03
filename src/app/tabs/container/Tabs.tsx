import {observer}       from 'mobx-react';
import {Component, h}   from 'preact';
import {files, uploads} from '../../../state';
import {bind}           from '../../../utils/preact-utils';
import {FileList}       from '../filelist/FileList';
import {Settings}       from '../settings/Settings';
import {TabHeader}      from './TabHeader';
import {Uploads}        from '../uploads/Uploads';
import {TabViews}       from './TabViews';
import styles           from './Tabs.module.scss';

type Props = {};
type State = {
    tabIndex: number;
};

@observer
export class Tabs extends Component<Props, State> {

    /* eslint-disable react/jsx-key */
    private readonly views = [<FileList/>, <Uploads/>, <Settings/>];

    readonly state = {
        tabIndex: 0
    };

    @bind
    changeTab(index: number) {
        this.setState({
            tabIndex: index
        });
    }

    render() {
        const {tabIndex} = this.state;
        const {listedUploads} = uploads;
        const {listedFiles} = files;

        const titles = [
            listedFiles.length ? `Files (${listedFiles.length})` : 'Files',
            listedUploads.length ? `Uploads (${listedUploads.length})` : 'Uploads',
            'Settings'
        ];

        return (
            <div className={styles.tabs}>
                <TabHeader tabs={titles}
                           activeTab={tabIndex}
                           onChange={this.changeTab}/>

                <TabViews views={this.views} activeView={tabIndex}/>
            </div>
        );
    }
}
