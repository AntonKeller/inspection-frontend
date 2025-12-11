import createLoanAgreementsApi from "@/utils/api_2/loan-agreements-api";
import useAxios from "@/composables/useAxios";

export default function useLoanAgreementsApi() {
    return createLoanAgreementsApi(useAxios());
}