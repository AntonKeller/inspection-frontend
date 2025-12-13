import type {
    PledgeAgreementCreateDTO,
    PledgeAgreementResponseDTO,
    PledgeAgreementUpdateDTO
} from "@/DTO/PledgeAgreement-dto";
import axios, {type AxiosInstance, type AxiosResponse} from "axios";

export default function createPledgeAgreementsApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/pledge-agreements'
    });

    return {

        async fetchAll(): Promise<AxiosResponse<PledgeAgreementResponseDTO[]>> {
            return api.get('/all');
        },

        async fetchOne(id: string): Promise<AxiosResponse<PledgeAgreementResponseDTO>> {
            return api.get(`/one/${id}`);
        },

        async create(data: PledgeAgreementCreateDTO): Promise<AxiosResponse<PledgeAgreementResponseDTO>> {
            return api.post(`/create`, data);
        },

        async update(id: string, data: PledgeAgreementUpdateDTO): Promise<AxiosResponse<PledgeAgreementResponseDTO>> {
            return api.put(`/update/${id}`, data);
        },

        async removeOne(id: string): Promise<AxiosResponse<PledgeAgreementResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        async removeMany(ids: string): Promise<AxiosResponse<PledgeAgreementResponseDTO>> {
            return api.post('/remove-many', ids);
        },
    }
}
