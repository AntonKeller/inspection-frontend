import useAxios from "@/composables/useAxios";
import createTargetAddressesApi from "@/utils/api_2/target-addresses-api";

export default function useTargetAddressesApi() {
    return createTargetAddressesApi(useAxios());
}