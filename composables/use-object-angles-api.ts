import useAxios from "@/composables/useAxios";
import createObjectAnglesApi from "@/utils/api_2/object-angles-api";

export default function useObjectAnglesApi() {
    return createObjectAnglesApi(useAxios());
}