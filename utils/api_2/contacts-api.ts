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
            return api.get(`/all`)
                .then(r => {
                    return r.data || [];
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        fetchOne(id: string): Promise<AxiosResponse<ContactResponseDTO>> {
            return api.get(`/one/${id}`)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        create(data: ContactCreateDTO): Promise<AxiosResponse<ContactResponseDTO>> {
            return api.post(`/create`, data)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        update(id: string, data: ContactUpdateDTO): Promise<AxiosResponse<ContactResponseDTO>> {
            return api.put(`/update${id}`, data)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        removeOne(id: string): Promise<AxiosResponse<ContactResponseDTO>> {
            return api.delete(`/one/${id}`)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        removeMany(ids: string): Promise<AxiosResponse<ContactResponseDTO[]>> {
            return api.post('/remove-many', ids)
                .then(r => {
                    return r.data || [];
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },
    }
}