// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Parser } from 'm3u8-parser';
import { request } from './service/request';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const workerThreads = require('worker_threads');

const main = async () => {
    const parser = new Parser();
    // lg mq hq hd
    const url =
        'https://vod.linom.org/media/General-physics-2/10-1VvBCfmp2DS/hq/playlist.m3u8';
    const manifest = await request(url);
    parser.push(manifest.response?.data);
    parser.end();
    const parsedManifest: Manifest = parser.manifest;
    for (let i = 0; i < 1; i++) {
        const worker = new workerThreads.Worker('./dist/service/simulate.js', {
            workerData: {
                segments: JSON.stringify(parsedManifest.segments),
                baseUrl: url.replace(/\/playlist.m3u8/, ''),
            },
        });
    }
};

main();

export interface Manifest {
    allowCache: boolean;
    endList: boolean;
    mediaSequence: number;
    discontinuitySequence: number;
    playlistType: string;
    custom: Record<string, unknown>;
    playlists: [
        {
            attributes: Record<string, unknown>;
            Manifest: any;
        },
    ];
    mediaGroups: {
        AUDIO: {
            'GROUP-ID': {
                NAME: {
                    default: boolean;
                    autoselect: boolean;
                    language: string;
                    uri: string;
                    instreamId: string;
                    characteristics: string;
                    forced: boolean;
                };
            };
        };
        VIDEO: Record<string, unknown>;
        'CLOSED-CAPTIONS': Record<string, unknown>;
        SUBTITLES: Record<string, unknown>;
    };
    dateTimeString: string;
    dateTimeObject: Date;
    targetDuration: number;
    totalDuration: number;
    discontinuityStarts: [number];
    segments: [
        {
            byterange: {
                length: number;
                offset: number;
            };
            duration: number;
            attributes: Record<string, unknown>;
            discontinuity: number;
            uri: string;
            timeline: number;
            key: {
                method: string;
                uri: string;
                iv: string;
            };
            map: {
                uri: string;
                byterange: {
                    length: number;
                    offset: number;
                };
            };
            'cue-out': string;
            'cue-out-cont': string;
            'cue-in': string;
            custom: Record<string, unknown>;
        },
    ];
}
