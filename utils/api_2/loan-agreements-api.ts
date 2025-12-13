import axios, {type AxiosInstance, type AxiosResponse} from "axios";
import type {LoanAgreementCreateDTO, LoanAgreementResponseDTO, LoanAgreementUpdateDTO} from "@/DTO/LoanAgreement-dto";

export default function createLoanAgreementsApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/loan-agreements'
    });

    return {

        fetchAll(): Promise<AxiosResponse<LoanAgreementResponseDTO[]>> {
            return api.get(`/all`);
        },

        fetchOne(id: string): Promise<AxiosResponse<LoanAgreementResponseDTO>> {
            return api.get(`/one/${id}`);
        },

        create(data: LoanAgreementCreateDTO): Promise<AxiosResponse<LoanAgreementResponseDTO>> {
            return api.post(`/create`, data);
        },

        update(id: string, data: LoanAgreementUpdateDTO): Promise<AxiosResponse<LoanAgreementResponseDTO>> {
            return api.put(`/update/${id}`, data);
        },

        removeOne(id: string): Promise<AxiosResponse<LoanAgreementResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        removeMany(ids: string): Promise<AxiosResponse<LoanAgreementResponseDTO[]>> {
            return api.post('/remove-many', ids);
        },
    }
}