import type {AxiosInstance, AxiosResponse} from "axios";
import type {ContactCreateDTO, ContactResponseDTO, ContactUpdateDTO} from "@/DTO/Contact-dto";
import axios from "axios";


export default function createContactsApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/contacts'
    })

    return {

        fetchAll(): Promise<AxiosResponse<ContactResponseDTO[]>> {
            return api.get(`/all`);
        },

        fetchOne(id: string): Promise<AxiosResponse<ContactResponseDTO>> {
            return api.get(`/one/${id}`);
        },

        create(data: ContactCreateDTO): Promise<AxiosResponse<ContactResponseDTO>> {
            return api.post(`/create`, data);
        },

        update(id: string, data: ContactUpdateDTO): Promise<AxiosResponse<ContactResponseDTO>> {
            return api.put(`/update/${id}`, data);
        },

        removeOne(id: string): Promise<AxiosResponse<ContactResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        removeMany(ids: string): Promise<AxiosResponse<ContactResponseDTO[]>> {
            return api.post('/remove-many', ids);
        },
    }
}