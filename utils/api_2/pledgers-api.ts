import axios, {type AxiosInstance, type AxiosResponse} from "axios";
import type {PledgerCreateDTO, PledgerResponseDTO, PledgerUpdateDTO} from "@/DTO/Pledger-dto";


export default function createPledgersApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/pledgers'
    });

    return {

        fetchAll(): Promise<PledgerResponseDTO[]> {
            return api.get(`/all`)
        },

        fetchOne(id: string): Promise<AxiosResponse<PledgerResponseDTO>> {
            return api.get(`/one/${id}`);
        },

        create(data: PledgerCreateDTO): Promise<AxiosResponse<PledgerResponseDTO>> {
            return api.post(`/create`, data);
        },

        update(id: string, data: PledgerUpdateDTO): Promise<AxiosResponse<PledgerResponseDTO>> {
            return api.put(`/update/${id}`, data);
        },

        removeOne(id: string): Promise<AxiosResponse<PledgerResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        removeMany(ids: string): Promise<AxiosResponse<PledgerResponseDTO[]>> {
            return api.post('/remove-many', ids);
        },
    }
}