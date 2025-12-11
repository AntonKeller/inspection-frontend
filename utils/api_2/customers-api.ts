import axios, {type AxiosInstance} from "axios";
import type {AxiosResponse} from "axios";
import type {CustomerCreateDTO, CustomerResponseDTO, CustomerUpdateDTO} from "@/DTO/Customer-dto";


export default function createCustomersApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/customers'
    });

    return {

        fetchAll(): Promise<AxiosResponse<CustomerResponseDTO[]>> {
            return api.get(`/all`)
                .then(r => {
                    return r.data || [];
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        fetchOne(id: string): Promise<AxiosResponse<CustomerResponseDTO>> {
            return api.get(`/one/${id}`)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        create(data: CustomerCreateDTO): Promise<AxiosResponse<CustomerResponseDTO>> {
            return api.post(`/create`, data)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        update(id: string, data: CustomerUpdateDTO): Promise<AxiosResponse<CustomerResponseDTO>> {
            return api.put(`/update${id}`, data)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        removeOne(id: string): Promise<AxiosResponse<CustomerResponseDTO>> {
            return api.delete(`/one/${id}`)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        removeMany(ids: string): Promise<AxiosResponse<CustomerResponseDTO[]>> {
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