/* eslint-disable no-console */
import GracefulWebSocket    from 'graceful-ws';
import {action, observable} from 'mobx';
import {XHUpload}           from '../../utils/XHUpload';
import {files, Keys}        from './Files';
import {uploads}            from './Uploads';

export type ConnectionState = 'connected' | 'disconnected';

class Socket {
    @observable public connectionState: ConnectionState;
    private readonly ws: GracefulWebSocket;

    constructor() {
        this.ws = new GracefulWebSocket(env.WS_ENDPOINT);
        this.connectionState = 'disconnected';

        this.ws.addEventListener('connected', () => {
            console.log('[WS] Connected!');
            this.updateState('connected');
        });

        this.ws.addEventListener('disconnected', () => {
            console.log('[WS] Disconnected!');
            this.updateState('disconnected');
        });

        this.ws.addEventListener('message', e => {
            try {
                const {type, payload} = JSON.parse((e as MessageEvent).data);
                this.onMessage(type, payload);
            } catch (e) {

            }
        });
    }

    public sendMessage(type: string, payload: unknown): void {
        this.ws.send(JSON.stringify({type, payload}));
    }

    @action
    private updateState(newState: ConnectionState) {
        this.connectionState = newState;
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private onMessage(type: string, payload: any): void {
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
                    new XHUpload(`${env.API_ENDPOINT}/file/${downloadId}`, item.file)
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
    }

}

export const socket = new Socket();
