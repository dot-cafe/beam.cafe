/* eslint-disable no-console */
import GracefulWebSocket      from 'graceful-ws';
import {listedFiles, uploads} from '../state';
import {Keys}                 from '../state/models/ListedFiles';
import {XHUpload}             from '../utils/XHUpload';

const ws = new GracefulWebSocket('ws://localhost:8080');

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
                listedFiles.updateKeys(payload as Keys);
                break;
            }
            case 'file-request': {
                const {fileKey, downloadId} = payload;

                const item = listedFiles.files.find(
                    value => value.key === fileKey
                );

                if (!item) {
                    console.warn('[WS] File not longer available...');
                    break;
                }

                uploads.registerUpload(
                    new XHUpload(`http://localhost:8080/share/${downloadId}`, item.file),
                    item
                );

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
