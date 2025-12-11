import useAxios from "@/composables/useAxios";
import createAnglesApi from "@/utils/api_2/angles-api";

export default function useAuthApi() {
    return createAnglesApi(useAxios());
}