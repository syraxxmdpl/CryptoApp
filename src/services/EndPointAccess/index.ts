import axios, { AxiosResponse } from 'axios';

export default class EndPointAccess {
    private theUrl: string;

    constructor(url: string) {
        this.theUrl = url;
    }

    async getRes<T>(): Promise<AxiosResponse<T>> {
        const response = await axios.get<T>(this.theUrl);
        return response;
    }
}