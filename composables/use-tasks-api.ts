import useAxios from "@/composables/useAxios";
import createTasksApi from "@/utils/api_2/tasks-api";

export default function useTasksApi() {
    return createTasksApi(useAxios());
}