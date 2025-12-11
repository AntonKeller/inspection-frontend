import createObjectTypesApi from "@/utils/api_2/object-types-api";
import useAxios from "@/composables/useAxios";

export default function useObjectTypesApi() {
    return createObjectTypesApi(useAxios());
}