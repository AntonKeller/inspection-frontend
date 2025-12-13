import axios, {type AxiosInstance, type AxiosResponse} from "axios";
import type {TemplateCreateDTO, TemplateResponseDTO, TemplateUpdateDTO} from "@/DTO/Template-dto";


export default function createTemplatesApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/templates'
    });

    return {

        fetchAll(): Promise<AxiosResponse<TemplateResponseDTO[]>> {
            return api.get(`/all`);
        },

        fetchOne(id: string): Promise<AxiosResponse<TemplateResponseDTO>> {
            return api.get(`/one/${id}`);
        },

        create(data: TemplateCreateDTO): Promise<AxiosResponse<TemplateResponseDTO>> {
            return api.post(`/create`, data);
        },

        async downloadTemplate() {
            return api.post('/download-template-xlsx', {}, {
                responseType: 'blob'
            });
        },

        uploadTemplate(formData: FormData) {
            return api.post('/upload-template-xlsx', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        },

        update(id: string, data: TemplateUpdateDTO): Promise<AxiosResponse<TemplateResponseDTO>> {
            return api.put(`/update/${id}`, data);
        },

        removeOne(id: string): Promise<AxiosResponse<TemplateResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        removeMany(ids: string): Promise<AxiosResponse<TemplateResponseDTO[]>> {
            return api.post('/remove-many', ids);
        },
    }
}