import useAxios from "@/composables/useAxios";
import createPledgeAgreementsApi from "@/utils/api_2/pledge-agreements-api";

export default function usePledgeAgreementsApi() {
    return createPledgeAgreementsApi(useAxios());
}