/* eslint-disable no-console */
import GracefulWebSocket from 'graceful-ws';
import {files, uploads}  from '../state';
import {Keys}            from '../state/models/Files';
import {XHUpload}        from '../utils/XHUpload';

const ws = new GracefulWebSocket(env.WS_ENDPOINT);

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
            case 'file-registrations': {
                files.enableFiles(payload as Keys);
                break;
            }
            case 'file-request': {
                const {fileId, downloadId} = payload;

                const item = files.listedFiles.find(
                    value => value.id === fileId
                );

                if (!item) {
                    console.warn('[WS] File not longer available...');
                    break;
                }

                uploads.registerUpload(
                    downloadId, item,
                    new XHUpload(`${env.API_ENDPOINT}/share/${downloadId}`, item.file)
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
