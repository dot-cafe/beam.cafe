/* eslint-disable no-console */
import GracefulWebSocket from 'graceful-ws';
import {listedFiles}     from '../state';
import {Keys}            from '../state/models/ListedFiles';
import {upload}          from '../utils/upload';

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
            case 'res-download-keys': {
                listedFiles.updateKeys(payload as Keys);
                break;
            }
            case 'req-file': {
                const item = listedFiles.files.find(
                    value => value.key === payload
                );

                if (item) {
                    upload(
                        `http://localhost:8080/share/${payload}`, item.file
                    ).then(() => console.log('ok'));
                } else {
                    console.warn('[WS] File not longer available...');
                }
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
