import axios, {type AxiosInstance, type AxiosResponse} from "axios";
import type {CustomerCreateDTO, CustomerResponseDTO, CustomerUpdateDTO} from "@/DTO/Customer-dto";


export default function createCustomersApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/customers'
    });

    return {

        fetchAll(): Promise<AxiosResponse<CustomerResponseDTO[]>> {
            return api.get(`/all`);
        },

        fetchOne(id: string): Promise<AxiosResponse<CustomerResponseDTO>> {
            return api.get(`/one/${id}`);
        },

        create(data: CustomerCreateDTO): Promise<AxiosResponse<CustomerResponseDTO>> {
            return api.post(`/create`, data);
        },

        update(id: string, data: CustomerUpdateDTO): Promise<AxiosResponse<CustomerResponseDTO>> {
            return api.put(`/update/${id}`, data);
        },

        removeOne(id: string): Promise<AxiosResponse<CustomerResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        removeMany(ids: string): Promise<AxiosResponse<CustomerResponseDTO[]>> {
            return api.post('/remove-many', ids);
        },
    }
}