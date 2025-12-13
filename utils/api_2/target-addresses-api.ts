import axios, {type AxiosInstance, type AxiosResponse} from "axios";
import type {TargetAddressCreateDTO, TargetAddressResponseDTO, TargetAddressUpdateDTO} from "@/DTO/TargetAddress-dto";


export default function createTargetAddressesApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/target-addresses'
    });

    return {

        fetchAll(): Promise<TargetAddressResponseDTO[]> {
            return api.get(`/all`);
        },

        fetchAllByTask(id: string): Promise<TargetAddressResponseDTO[]> {
            return api.get(`/by-task/${id}`);
        },

        fetchOne(id: string): Promise<AxiosResponse<TargetAddressResponseDTO>> {
            return api.get(`/one/${id}`);
        },

        create(data: TargetAddressCreateDTO): Promise<AxiosResponse<TargetAddressResponseDTO>> {
            return api.post(`/create`, data);
        },

        update(id: string, data: TargetAddressUpdateDTO): Promise<AxiosResponse<TargetAddressResponseDTO>> {
            return api.put(`/update/${id}`, data);
        },

        removeOne(id: string): Promise<AxiosResponse<TargetAddressResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        removeMany(ids: string): Promise<AxiosResponse<TargetAddressResponseDTO[]>> {
            return api.post('/remove-many', ids);
        },
    }
}