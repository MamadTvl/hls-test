import { request } from './request';
import { Manifest } from './../index';
import { parentPort, workerData } from 'worker_threads';
class Simulate {
    maxBufferLength = 60;
    constructor(
        private segments: Manifest['segments'],
        private baseUrl: string,
        private label: string,
    ) {}

    static async sleep(ms: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    async run() {
        let fetchedDuration = 0;
        let sumOfResponseTime = 0;
        console.log(`segments length: ${this.segments.length}`);
        let index = 0;
        for (const segment of this.segments) {
            if (fetchedDuration >= 60) {
                console.log(`sleeping 30s`);
                Simulate.sleep(30 * 1000);
                fetchedDuration = 0;
            }
            const fetchData = await request(`${this.baseUrl}/${segment.uri}`);
            console.log(
                `${index + 1}/${this.segments.length} | time: ${
                    fetchData.time
                } ms`,
            );
            sumOfResponseTime += fetchData.time;
            fetchedDuration += segment.duration;
            index++;
        }
        console.log(
            this.label,
            `avg: ${sumOfResponseTime / this.segments.length} ms`,
        );
    }
}

const simulate = new Simulate(
    JSON.parse(workerData.segments),
    workerData.baseUrl,
    workerData.label,
);
simulate.run();
