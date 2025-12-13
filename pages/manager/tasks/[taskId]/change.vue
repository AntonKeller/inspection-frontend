<template>
  <v-container fluid class="bg-white">
    <v-sheet min-width="400" max-width="1024">

      <v-card variant="text">
        <v-card-item>
          <v-btn v-bind="navigateBackBtnStyle" @click="navigateBack">
            Назад
            <v-tooltip activator="parent" location="left">
              Вернуться назад
            </v-tooltip>
          </v-btn>
        </v-card-item>
      </v-card>

      <v-card variant="flat" :loading="loading" :disabled="loading">

        <v-card-title>Редактирование задания</v-card-title>
        <v-card-subtitle>Заполните поля</v-card-subtitle>

        <v-card-item>
          <v-form v-model="formIsValid" ref="form" class="d-flex flex-column mt-2">
            <v-row dense>
              <v-col :cols="12">
                <v-text-field
                    v-model="task.title"
                    v-bind="inputFieldStyle"
                    :rules="[v => v && v?.length <= 50 || 'Кол-во символов должно быть <= 50']"
                    label="Заголовок задания"
                    prepend-inner-icon="mdi-label-variant-outline"
                />
              </v-col>
              <v-col :cols="12">
                <my-autocomplete-customers v-model="task.customer"/>
              </v-col>
              <v-col :cols="12">
                <my-autocomplete-contracts v-model="task.contract"/>
              </v-col>
              <v-col :cols="12">
                <my-autocomplete-subContracts
                    v-model="task.subContract"
                    :parentID="task.contract?._id || null"
                />
              </v-col>
              <v-col :cols="12">
                <my-autocomplete-loanAgreements v-model="task.loanAgreements"/>
              </v-col>
              <v-col :cols="12">
                <my-autocomplete-pledgeAgreements v-model="task.pledgeAgreements"/>
              </v-col>
            </v-row>
          </v-form>
        </v-card-item>

        <v-card-actions>
          <my-btn-submit
              text="Принять"
              prepend-icon="mdi-checkbox-multiple-marked-outline"
              @click="handleUpdateTask"
          />
          <my-button-clear text="Очистить" @click="clearFields"/>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script setup>
import {navigateBackBtnStyle, inputFieldStyle} from "@/configs/styles";
import {navigateTo} from "nuxt/app";
import {useStore} from "vuex";
import useTasksApi from "@/composables/use-tasks-api";


const {fetchOne: fetchOneTask, update: updateTask} = useTasksApi();
const vuexStore = useStore();
const task = ref({});
const formIsValid = ref(false);
const form = ref();
const loading = ref(false);


onMounted(() => {
  handleFetchTask();
})


async function handleUpdateTask() {

  const id = useRoute().params.taskId;
  if (!id) return;

  await form.value.validate();

  if (!formIsValid.value) {
    vuexStore.commit('alert/ERROR', 'Поля заполнены некорректно!');
    return;
  }

  loading.value = true;

  return updateTask(id, task.value)
      .then(() => {
        vuexStore.commit('alert/SUCCESS', 'Документ успешно отредактирован');
        navigateBack();
      })
      .catch(e => {
        console.log('Ошибка редактирования', e);
        vuexStore.commit('alert/ERROR', 'Ошибка редактирования');
      })
      .finally(() => loading.value = false)
}

function handleFetchTask() {
  if (!useRoute().params.taskId) return;
  return fetchOneTask(useRoute().params.taskId)
      .then(resp => {
        task.value = resp.data || {};
      })
      .catch(e => {
        console.log('Ошибка получения данных', e);
        vuexStore.commit('alert/SUCCESS', 'Задание не существует или было удално');
        navigateBack();
      })
}

function navigateBack() {
  navigateTo(`/manager/tasks`);
}

function clearFields() {
  task.value = {
    ...task.value,
    title: null,
    customer: null, // Заказчик
    contract: null, // Договор
    loanAgreements: null, // Кредитный договор
    pledgeAgreements: null, // Договор залога
  }
}
</script>