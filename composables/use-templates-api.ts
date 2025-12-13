import useAxios from "@/composables/useAxios";
import createTemplatesApi from "@/utils/api_2/templates-api";

export default function useTemplatesApi() {
    return createTemplatesApi(useAxios());
}