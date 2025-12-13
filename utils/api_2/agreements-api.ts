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
            return api.get(`/all`);
        },

        fetchOne(id: string): Promise<AxiosResponse<AgreementResponseDTO>> {
            return api.get(`/one/${id}`);
        },

        create(data: AgreementCreateDTO): Promise<AxiosResponse<AgreementResponseDTO>> {
            return api.post(`/create`, data);
        },

        update(id: string, data: AgreementUpdateDTO): Promise<AxiosResponse<AgreementResponseDTO>> {
            return api.put(`/update/${id}`, data);
        },


        removeOne(id: string): Promise<AxiosResponse<AgreementResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        removeMany(ids: string[]): Promise<AxiosResponse<AgreementResponseDTO[]>> {
            return api.post(`/remove-many`, ids);
        },
    }
}