import axios, {type AxiosInstance, type AxiosResponse} from "axios";
import type {RoleCreateDTO, RoleResponseDTO, RoleUpdateDTO} from "@/DTO/Role-dto";


export default function createRolesApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/roles'
    });

    return {

        fetchAll(): Promise<AxiosResponse<RoleResponseDTO[]>> {
            return api.get(`/all`);
        },

        fetchOne(id: string): Promise<AxiosResponse<RoleResponseDTO>> {
            return api.get(`/one/${id}`);
        },

        create(data: RoleCreateDTO): Promise<AxiosResponse<RoleResponseDTO>> {
            return api.post(`/create`, data);
        },

        update(id: string, data: RoleUpdateDTO): Promise<AxiosResponse<RoleResponseDTO>> {
            return api.put(`/update/${id}`, data);
        },

        removeOne(id: string): Promise<AxiosResponse<RoleResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        removeMany(ids: string): Promise<AxiosResponse<RoleResponseDTO[]>> {
            return api.post('/remove-many', ids);
        },
    }
}