import createAuthApi from "@/utils/api_2/auth-api";
import useAxios from "@/composables/useAxios";

export default function useAuthApi() {
    return createAuthApi(useAxios());
}