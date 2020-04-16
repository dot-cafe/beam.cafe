/* eslint-disable no-console */
import GracefulWebSocket from 'graceful-ws';
import {files, uploads}  from '../state';
import {Keys}            from '../state/models/Files';
import {XHUpload}        from '../utils/XHUpload';

const ws = new GracefulWebSocket('ws://192.168.178.49:8080');

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
                const {fileKey, id} = payload;

                const item = files.listedFiles.find(
                    value => value.key === fileKey
                );

                if (!item) {
                    console.warn('[WS] File not longer available...');
                    break;
                }

                uploads.registerUpload(
                    id, item,
                    new XHUpload(`http://192.168.178.49:8080/share/${id}`, item.file)
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
