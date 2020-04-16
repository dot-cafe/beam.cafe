/* eslint-disable no-console */
import GracefulWebSocket from 'graceful-ws';
import {files, uploads}  from '../state';
import {Keys}            from '../state/models/Files';
import {XHUpload}        from '../utils/XHUpload';

const ws = new GracefulWebSocket('ws://79.214.150.228:8080');

ws.addEventListener('connected', () => {
    console.log('[WS] Connected!');
});

ws.addEventListener('disconnected', () => {
    console.log('[WS] Disconnected!');
});

ws.addEventListener('message', e => {
    try {
        const {type, payload} = JSON.parse((e as MessageEvent).data);
        switch (type) {
            case 'download-keys': {
                files.updateKeys(payload as Keys);
                break;
            }
            case 'file-request': {
                const {fileKey, downloadId} = payload;

                const item = files.listedFiles.find(
                    value => value.key === fileKey
                );

                if (!item) {
                    console.warn('[WS] File not longer available...');
                    break;
                }

                uploads.registerUpload(
                    downloadId, item,
                    new XHUpload(`http://79.214.150.228:8080/share/${downloadId}`, item.file)
                );

                break;
            }
            case 'download-cancelled': {
                uploads.updateUploadState(payload, 'peer-cancelled');
                break;
            }
            default: {
                console.warn(`[WS] Unknown action: ${type}`);
            }
        }
    } catch (e) {

    }
});

export const socket = ws;
