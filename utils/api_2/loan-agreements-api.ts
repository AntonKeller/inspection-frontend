import axios, {type AxiosInstance, type AxiosResponse} from "axios";
import {LoanAgreementCreateDTO, LoanAgreementResponseDTO, LoanAgreementUpdateDTO} from "@/DTO/LoanAgreement-dto";

export default function createLoanAgreementsApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/loan-agreements'
    });

    return {

        fetchAll(): Promise<AxiosResponse<LoanAgreementResponseDTO[]>> {
            return api.get(`/all`)
                .then(r => {
                    return r.data || [];
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        fetchOne(id: string): Promise<AxiosResponse<LoanAgreementResponseDTO>> {
            return api.get(`/one/${id}`)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        create(data: LoanAgreementCreateDTO): Promise<AxiosResponse<LoanAgreementResponseDTO>> {
            return api.post(`/create`, data)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        update(id: string, data: LoanAgreementUpdateDTO): Promise<AxiosResponse<LoanAgreementResponseDTO>> {
            return api.put(`/update${id}`, data)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        removeOne(id: string): Promise<AxiosResponse<LoanAgreementResponseDTO>> {
            return api.delete(`/one/${id}`)
                .then(r => {
                    return r.data;
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },

        removeMany(ids: string): Promise<AxiosResponse<LoanAgreementResponseDTO[]>> {
            return api.post('/remove-many', ids)
                .then(r => {
                    return r.data || [];
                })
                .catch(e => {
                    console.log('Ошибка', e);
                });
        },
    }
}