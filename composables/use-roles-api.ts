import createRolesApi from "@/utils/api_2/roles-api";
import useAxios from "@/composables/useAxios";

export default function useRolesApi() {
    return createRolesApi(useAxios());
}