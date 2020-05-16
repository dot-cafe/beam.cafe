import {FunctionalComponent, h} from 'preact';
import {useState}               from 'preact/hooks';
import {files, uploads}         from '../../../state';
import {FileList}               from '../filelist/FileList';
import {Settings}               from '../settings/Settings';
import {TabHeader}              from './TabHeader';
import {Uploads}                from '../uploads/Uploads';
import {TabViews}               from './TabViews';
import styles                   from './Tabs.module.scss';

/* eslint-disable react/jsx-key */
const views = [<FileList/>, <Uploads/>, <Settings/>];

export const Tabs: FunctionalComponent = () => {
    const [tabIndex, setTab] = useState(
        env.NODE_ENV === 'development' ? Number(localStorage.getItem('--dev-tab-index')) || 0 : 0
    );

    const {listedUploads} = uploads;
    const {listedFiles} = files;

    const changeTab = (index: number) => {
        setTab(index);

        if (env.NODE_ENV === 'development') {
            localStorage.setItem('--dev-tab-index', String(tabIndex));
        }
    };

    const titles = [
        listedFiles.length ? `Files (${listedFiles.length})` : 'Files',
        listedUploads.length ? `Uploads (${listedUploads.length})` : 'Uploads',
        'Settings'
    ];

    return (
        <div className={styles.tabs}>
            <TabHeader tabs={titles}
                       activeTab={tabIndex}
                       onChange={changeTab}/>

            <TabViews views={views}
                      changeView={changeTab}
                      activeView={tabIndex}/>
        </div>
    );
};
