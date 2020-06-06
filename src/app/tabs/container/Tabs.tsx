import {files, uploads}         from '@state/index';
import {observer}               from 'mobx-react';
import {FunctionalComponent, h} from 'preact';
import {useState}               from 'preact/hooks';
import {isMobile}               from '../../browserenv';
import {FileList}               from '../filelist/FileList';
import {Settings}               from '../settings/Settings';
import {Uploads}                from '../uploads/Uploads';
import {TabHeader}              from './TabHeader';
import styles                   from './Tabs.module.scss';
import {TabViews}               from './TabViews';

/* eslint-disable react/jsx-key */
const views = [<FileList/>, <Uploads/>, <Settings/>];

// TODO: Shortcuts?
export const Tabs: FunctionalComponent = observer(() => {
    const [tabIndex, setTab] = useState(
        env.NODE_ENV === 'development' ? Number(localStorage.getItem('--dev-tab-index')) || 0 : 0
    );

    const {listedUploads} = uploads;
    const {listedFiles} = files;

    const changeTab = (index: number) => {
        setTab(index);

        if (env.NODE_ENV === 'development') {
            localStorage.setItem('--dev-tab-index', String(index));
        }
    };

    const titles = [
        listedFiles.length && !isMobile ? `Files (${listedFiles.length})` : 'Files',
        listedUploads.length && !isMobile ? `Uploads (${listedUploads.length})` : 'Uploads',
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
});
