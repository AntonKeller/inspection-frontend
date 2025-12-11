import createCustomersApi from "@/utils/api_2/customers-api";
import useAxios from "@/composables/useAxios";

export default function useCustomersApi() {
    return createCustomersApi(useAxios());
}