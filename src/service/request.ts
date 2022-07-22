import axios, { AxiosResponse } from 'axios';
interface RequestData {
    response: AxiosResponse | null;
    time: number;
}
export const request = async (url: string): Promise<RequestData> => {
    const start = new Date();
    let response = null;
    try {
        response = await axios(url);
    } catch (err) {
        console.log('error');
    }
    const end = new Date();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return {
        response,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        time: end - start,
    };
};
