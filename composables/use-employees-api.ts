import createEmployeesApi from "@/utils/api_2/employees-api";
import useAxios from "@/composables/useAxios";

export default function useEmployeesApi() {
    return createEmployeesApi(useAxios());
}