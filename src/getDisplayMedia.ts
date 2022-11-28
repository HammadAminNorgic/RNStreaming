
// @ts-nocheck
import { NativeModules } from 'react-native';
import * as RTCUtil from './RTCUtil';
import MediaStream from './MediaStream';
import MediaStreamError from './MediaStreamError';

const { VdotokStreamingModule } = NativeModules;

export default function getDisplayMedia(): Promise<MediaStream> {
    console.log('hellow')
    return new Promise((resolve, reject) => {
        let constraints:any={"audio": {},"video":true}
        VdotokStreamingModule.getDisplayMedia(constraints).then(
            // data => {
            //     const { streamId, track } = data;

            //     const info = {
            //         streamId: streamId,
            //         streamReactTag: streamId,
            //         tracks: [ track ]
            //     };

            //     const stream = new MediaStream(info);

            //     resolve(stream);
            // },
            // error => {
            //     reject(new MediaStreamError(error));
            // }
            data => {
                console.log('this is data received from screenshare',data)
                const { streamId, tracks } = data;
                // const { streamId, track } = data;
                for (const trackInfo of tracks) {
                    // @ts-ignore:next-line
                  const c = trackInfo.settings;
                  if (typeof c === 'object') {
                      trackInfo.constraints = RTCUtil.deepClone(c);
                  }
              }
              console.log('contraints after',tracks)
                const info = {
                    streamId: streamId,
                    streamReactTag: streamId,
                    tracks
                };
                 console.log('this is info getdisplay media=>',info)
                const stream = new MediaStream(info);
                console.log('hii srt',stream)
                resolve(stream);
            },
            error => {
                reject(new MediaStreamError(error));
            }
        );
    });
}
