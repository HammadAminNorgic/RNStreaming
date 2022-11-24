
// @ts-nocheck
import { NativeModules } from 'react-native';

import MediaStream from './MediaStream';
import MediaStreamError from './MediaStreamError';

const { VdotokStreamingModule } = NativeModules;

export default function getDisplayMedia(): Promise<MediaStream> {
    console.log('hellow')
    return new Promise((resolve, reject) => {
        VdotokStreamingModule.getDisplayMedia().then(
            data => {
                const { streamId, track } = data;

                const info = {
                    streamId: streamId,
                    streamReactTag: streamId,
                    tracks: [ track ]
                };

                const stream = new MediaStream(info);

                resolve(stream);
            },
            error => {
                reject(new MediaStreamError(error));
            }
        );
    });
}
