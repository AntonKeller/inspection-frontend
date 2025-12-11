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
            return api.get(`/all`)
                .then(r => {
                    return r.data || [];
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        fetchAllByObjectType(id: string): Promise<AxiosResponse<AngleResponseDTO[]>> {
            return api.get(`/all-by-object-type/${id}`)
                .then(r => {
                    return r.data || [];
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        create(data: AngleCreateDTO): Promise<AxiosResponse<AngleResponseDTO>> {
            return api.post(`/create`, data)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        update(id: string, data: AngleUpdateDTO): Promise<AxiosResponse<AngleResponseDTO>> {
            return api.put(`/update/${id}`, data)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        deleteOne(id: string): Promise<AxiosResponse<AngleResponseDTO>> {
            return api.delete(`/one/${id}`)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        deleteMany(ids: string[]): Promise<AxiosResponse<AngleResponseDTO[]>> {
            return api.post(`/remove-many`, ids)
                .then(r => {
                    return r.data || [];
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },
    }
}