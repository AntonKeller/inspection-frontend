import createAgreementsApi from "@/utils/api_2/agreements-api";
import useAxios from "@/composables/useAxios";

export default function useAgreementsApi() {
    return createAgreementsApi(useAxios());
}