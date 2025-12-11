import axios, {type AxiosInstance} from "axios";

let cachedInstance: AxiosInstance | null = null;

export default function useAxios(token?: string, url?: string): AxiosInstance {
    if (cachedInstance) return cachedInstance;
    // const defaultToken = (useCookie('token').value as string) || localStorage.getItem('token') || '';
    return axios.create({
        baseURL: url || (useRuntimeConfig().public.API_EXPRESS_URL as string),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            // "Authorization": "Bearer " + token || localStorage.getItem('token') || ''
        },
        withCredentials: true,
    });
}