import useAxios from "@/composables/useAxios";
import createAnglesApi from "@/utils/api_2/angles-api";

export default function useAnglesApi() {
    return createAnglesApi(useAxios());
}