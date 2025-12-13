import axios, {type AxiosInstance, type AxiosResponse} from "axios";
import type {EmployerResponseDTO} from "@/DTO/Employer-dto";


export default function createAuthApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/auth'
    });

    return {
        login(login: string, password: string): Promise<AxiosResponse<{ user: EmployerResponseDTO }>> {
            return api.post(`/login`, {login, password});
        },
    }
}