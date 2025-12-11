import type {AxiosInstance, AxiosResponse} from "axios";
import type {AgreementCreateDTO, AgreementResponseDTO, AgreementUpdateDTO} from "@/DTO/Agreement-dto";
import axios from "axios";


export default function createAgreementsApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/agreements'
    });

    return {

        fetchAll(): Promise<AxiosResponse<AgreementResponseDTO[]>> {
            return api.get(`/all`)
                .then(r => {
                    return r.data || [];
                })
                .catch(e => {
                    console.log('Ошибка получения данных', e);
                });
        },

        fetchOne(id: string): Promise<AxiosResponse<AgreementResponseDTO>> {
            return api.get(`/one/${id}`)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка получения данных', e);
                });
        },

        create(data: AgreementCreateDTO): Promise<AxiosResponse<AgreementResponseDTO>> {
            return api.post(`/create`, data)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка добавления', e);
                });
        },

        update(id: string, data: AgreementUpdateDTO): Promise<AxiosResponse<AgreementResponseDTO>> {
            return api.put(`/update/${id}`, data)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка обновления', e);
                });
        },


        removeOne(id: string): Promise<AxiosResponse<AgreementResponseDTO>> {
            return api.delete(`/one/${id}`)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка получения данных', e);
                });
        },

        removeMany(ids: string[]): Promise<AxiosResponse<AgreementResponseDTO[]>> {
            return api.post(`/remove-many`, ids)
                .then(r => {
                    return r.data || [];
                })
                .catch(e => {
                    console.log('Ошибка получения данных', e);
                });
        },
    }
}