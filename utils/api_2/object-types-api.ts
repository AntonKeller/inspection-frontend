import type {ObjectTypeCreateDTO, ObjectTypeResponseDTO, ObjectTypeUpdateDTO} from "@/DTO/ObjectType-dto";
import axios, {type AxiosInstance, type AxiosResponse} from "axios";


export default function createObjectTypesApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/object-types'
    });

    return {

        fetchAll(): Promise<AxiosResponse<ObjectTypeResponseDTO[]>> {
            return api.get(`/all`);
        },

        fetchAllByTemplate(id: string): Promise<AxiosResponse<ObjectTypeResponseDTO[]>> {
            return api.get(`/all-by-template/${id}`);
        },

        fetchMappedAllByTemplate(id: string): Promise<AxiosResponse<ObjectTypeResponseDTO[]>> {
            return api.get(`/all-mapped-angles/${id}`);
        },

        fetchOne(id: string): Promise<AxiosResponse<ObjectTypeResponseDTO>> {
            return api.get(`/one/${id}`);
        },

        create(data: ObjectTypeCreateDTO): Promise<AxiosResponse<ObjectTypeResponseDTO>> {
            return api.post(`/create`, data);
        },

        update(id: string, data: ObjectTypeUpdateDTO): Promise<AxiosResponse<ObjectTypeResponseDTO>> {
            return api.put(`/update/${id}`, data);
        },

        removeOne(id: string): Promise<AxiosResponse<ObjectTypeResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        removeMany(ids: string): Promise<AxiosResponse<ObjectTypeResponseDTO[]>> {
            return api.post('/remove-many', ids);
        },
    }
}