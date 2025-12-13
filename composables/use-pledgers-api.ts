import useAxios from "@/composables/useAxios";
import createPledgersApi from "@/utils/api_2/pledgers-api";

export default function usePledgersApi() {
    return createPledgersApi(useAxios());
}