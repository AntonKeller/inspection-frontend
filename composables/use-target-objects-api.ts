import useAxios from "@/composables/useAxios";
import createTargetObjectsApi from "@/utils/api_2/target-objects-api";

export default function useTargetObjectsApi() {
    return createTargetObjectsApi(useAxios());
}