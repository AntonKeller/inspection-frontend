import axios, {type AxiosInstance, type AxiosResponse} from "axios";
import type {PhotoResponseDTO} from "@/DTO/Photo-dto";


export default function createPhotosApi(instance: AxiosInstance) {

    const api = axios.create({
        ...instance.defaults,
        baseURL: instance.defaults.baseURL + '/photos'
    });

    return {

        fetchAllByObjectAngle(id: string): Promise<AxiosResponse<PhotoResponseDTO[]>> {
            return api.get(`/photos/${id}`);
        },

        fetchOne(id: string): Promise<AxiosResponse<PhotoResponseDTO>> {
            return api.get(`/photo/${id}`);
        },

        fetchOneSmall(id: string): Promise<AxiosResponse<PhotoResponseDTO>> {
            return api.get(`/photo-small/${id}`);
        },

        upload(files: File[], objectAngleId: string, description: string): Promise<AxiosResponse<PhotoResponseDTO[]>> {
            const formData = new FormData();

            // Добавляем файлы в поле photos[]
            files.forEach((file) => {
                formData.append("photos[]", file);
            });

            // Добавляем JSON
            formData.append("data", JSON.stringify({objectAngleId, description}));

            return api.post('/upload', formData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
        },

        removeOne(id: string): Promise<AxiosResponse<PhotoResponseDTO>> {
            return api.delete(`/one/${id}`);
        },

        removeMany(ids: string): Promise<AxiosResponse<PhotoResponseDTO[]>> {
            return api.post('/remove-many', ids);
        },
    }
}