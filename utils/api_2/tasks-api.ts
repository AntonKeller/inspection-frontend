import axios, {type AxiosInstance, type AxiosResponse} from "axios";
import type {TaskCreateDTO, TaskResponseDTO, TaskUpdateDTO} from "@/DTO/Task-dto";


export default function createTasksApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/tasks'
    });

    return {

        fetchAll(): Promise<TaskResponseDTO[]> {
            return api.get(`/all`)
        },

        fetchOne(id: string): Promise<AxiosResponse<TaskResponseDTO>> {
            return api.get(`/one/${id}`);
        },

        create(data: TaskCreateDTO): Promise<AxiosResponse<TaskResponseDTO>> {
            return api.post(`/create`, data);
        },

        update(id: string, data: TaskUpdateDTO): Promise<AxiosResponse<TaskResponseDTO>> {
            return api.put(`/update/${id}`, data);
        },

        removeOne(id: string): Promise<AxiosResponse<TaskResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        removeMany(ids: string): Promise<AxiosResponse<TaskResponseDTO[]>> {
            return api.post('/remove-many', ids);
        },
    }
}