import axios, {type AxiosInstance, type AxiosResponse} from "axios";
import type {ObjectAngleCreateDTO, ObjectAngleResponseDTO, ObjectAngleUpdateDTO} from "@/DTO/ObjectAngle-dto";


export default function createObjectAnglesApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/object-angles'
    });

    return {

        fetchAll(): Promise<ObjectAngleResponseDTO[]> {
            return api.get(`/all`);
        },

        fetchAllByTargetObject(id: string): Promise<ObjectAngleResponseDTO[]> {
            return api.get(`/by-target-object/${id}`);
        },

        fetchOne(id: string): Promise<AxiosResponse<ObjectAngleResponseDTO>> {
            return api.get(`/one/${id}`);
        },

        create(data: ObjectAngleCreateDTO): Promise<AxiosResponse<ObjectAngleResponseDTO>> {
            return api.post(`/create`, data);
        },

        update(id: string, data: ObjectAngleUpdateDTO): Promise<AxiosResponse<ObjectAngleResponseDTO>> {
            return api.put(`/update/${id}`, data);
        },

        removeOne(id: string): Promise<AxiosResponse<ObjectAngleResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        removeMany(ids: string): Promise<AxiosResponse<ObjectAngleResponseDTO[]>> {
            return api.post('/remove-many', ids);
        },
    }
}