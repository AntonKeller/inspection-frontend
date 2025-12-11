import type {ObjectTypeCreateDTO, ObjectTypeResponseDTO, ObjectTypeUpdateDTO} from "@/DTO/ObjectType-dto";
import axios, {type AxiosInstance, type AxiosResponse} from "axios";


export default function createObjectTypesApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/object-types'
    });

    return {

        fetchAll(): Promise<AxiosResponse<ObjectTypeResponseDTO[]>> {
            return api.get(`/all`)
                .then(r => {
                    return r.data || [];
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        fetchAllByTemplate(id: string): Promise<AxiosResponse<ObjectTypeResponseDTO[]>> {
            return api.get(`/all-by-template/${id}`)
                .then(r => {
                    return r.data || [];
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        fetchOne(id: string): Promise<AxiosResponse<ObjectTypeResponseDTO>> {
            return api.get(`/one/${id}`)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        create(data: ObjectTypeCreateDTO): Promise<AxiosResponse<ObjectTypeResponseDTO>> {
            return api.post(`/create`, data)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        update(id: string, data: ObjectTypeUpdateDTO): Promise<AxiosResponse<ObjectTypeResponseDTO>> {
            return api.put(`/update${id}`, data)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        removeOne(id: string): Promise<AxiosResponse<ObjectTypeResponseDTO>> {
            return api.delete(`/one/${id}`)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        removeMany(ids: string): Promise<AxiosResponse<ObjectTypeResponseDTO[]>> {
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