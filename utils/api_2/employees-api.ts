import type {EmployerCreateDTO, EmployerResponseDTO, EmployerUpdateDTO} from "@/DTO/Employer-dto";
import {type AxiosInstance, type AxiosResponse} from "axios";
import axios from "axios";


export default function createEmployeesApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/employees'
    });

    return {

        fetchAll(): Promise<AxiosResponse<EmployerResponseDTO[]>> {
            return api.get(`/all`);
        },

        fetchOne(id: string): Promise<AxiosResponse<EmployerResponseDTO>> {
            return api.get(`/one/${id}`);
        },

        create(data: EmployerCreateDTO): Promise<AxiosResponse<EmployerResponseDTO>> {
            return api.post(`/create`, data);
        },

        update(id: string, data: EmployerUpdateDTO): Promise<AxiosResponse<EmployerResponseDTO>> {
            return api.put(`/update/${id}`, data);
        },

        removeOne(id: string): Promise<AxiosResponse<EmployerResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        removeMany(ids: string): Promise<AxiosResponse<EmployerResponseDTO[]>> {
            return api.post('/remove-many', ids);
        },
    }
}