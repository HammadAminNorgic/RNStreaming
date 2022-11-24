// @ts-nocheck
import { defineCustomEventTarget } from 'event-target-shim';
import { NativeModules } from 'react-native';

import getDisplayMedia from './getDisplayMedia';
import getUserMedia from './getUserMedia';

const { VdotokStreamingModule } = NativeModules;

const MEDIA_DEVICES_EVENTS = [ 'devicechange' ];

class MediaDevices extends defineCustomEventTarget(...MEDIA_DEVICES_EVENTS) {
    /**
     * W3C "Media Capture and Streams" compatible {@code enumerateDevices}
     * implementation.
     */
    enumerateDevices() {
        return new Promise(resolve => VdotokStreamingModule.enumerateDevices(resolve));
    }

    /**
     * W3C "Screen Capture" compatible {@code getDisplayMedia} implementation.
     * See: https://w3c.github.io/mediacapture-screen-share/
     *
     * @returns {Promise}
     */
    getDisplayMedia() {
        return getDisplayMedia();
    }

    /**
     * W3C "Media Capture and Streams" compatible {@code getUserMedia}
     * implementation.
     * See: https://www.w3.org/TR/mediacapture-streams/#dom-mediadevices-enumeratedevices
     *
     * @param {*} constraints
     * @returns {Promise}
     */
    getUserMedia(constraints) {
        return getUserMedia(constraints);
    }
}

export default new MediaDevices();
