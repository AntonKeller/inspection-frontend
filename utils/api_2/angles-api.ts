import type {AxiosInstance, AxiosResponse} from "axios";
import type {AngleCreateDTO, AngleResponseDTO, AngleUpdateDTO} from "@/DTO/Angle-dto";
import axios from "axios";


export default function createAnglesApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/angles'
    });

    return {

        fetchAll(): Promise<AxiosResponse<AngleResponseDTO[]>> {
            return api.get(`/all`);
        },

        fetchAllByObjectType(id: string): Promise<AxiosResponse<AngleResponseDTO[]>> {
            return api.get(`/all-by-object-type/${id}`);
        },

        create(data: AngleCreateDTO): Promise<AxiosResponse<AngleResponseDTO>> {
            return api.post(`/create`, data);
        },

        update(id: string, data: AngleUpdateDTO): Promise<AxiosResponse<AngleResponseDTO>> {
            return api.put(`/update/${id}`, data);
        },

        removeOne(id: string): Promise<AxiosResponse<AngleResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        removeMany(ids: string[]): Promise<AxiosResponse<AngleResponseDTO[]>> {
            return api.post(`/remove-many`, ids);
        },
    }
}