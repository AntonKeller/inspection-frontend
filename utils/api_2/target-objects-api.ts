import axios, {type AxiosInstance, type AxiosResponse} from "axios";
import type {TargetObjectCreateDTO, TargetObjectResponseDTO, TargetObjectUpdateDTO} from "@/DTO/TargetObject-dto";


export default function createTargetObjectsApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/target-objects'
    });

    return {

        fetchAll(): Promise<TargetObjectResponseDTO[]> {
            return api.get(`/all`);
        },

        fetchAllByTargetAddress(id: string): Promise<TargetObjectResponseDTO[]> {
            return api.get(`/by-target-address/${id}`);
        },

        fetchOne(id: string): Promise<AxiosResponse<TargetObjectResponseDTO>> {
            return api.get(`/one/${id}`);
        },

        create(data: TargetObjectCreateDTO): Promise<AxiosResponse<TargetObjectResponseDTO>> {
            return api.post(`/create`, data);
        },

        update(id: string, data: TargetObjectUpdateDTO): Promise<AxiosResponse<TargetObjectResponseDTO>> {
            return api.put(`/update/${id}`, data);
        },

        removeOne(id: string): Promise<AxiosResponse<TargetObjectResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        removeMany(ids: string): Promise<AxiosResponse<TargetObjectResponseDTO[]>> {
            return api.post('/remove-many', ids);
        },

        removeManyByTargetAddress(id: string): Promise<AxiosResponse<TargetObjectResponseDTO[]>> {
            return api.delete(`/remove-many-by-target-address/${id}`);
        },
    }
}