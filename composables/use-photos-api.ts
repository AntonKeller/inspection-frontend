import useAxios from "@/composables/useAxios";
import createPhotosApi from "@/utils/api_2/photos-api";


export default function usePhotosApi() {
    return createPhotosApi(useAxios());
}