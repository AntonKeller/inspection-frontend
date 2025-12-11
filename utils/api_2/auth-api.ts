import {type AxiosInstance} from "axios";
import axios from "axios";


export default function createAuthApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/auth'
    });

    return {

        login(login: string, password: string) {
            return api.post(`/login`, {login, password})
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка авторизации', e);
                });
        },
    }
}