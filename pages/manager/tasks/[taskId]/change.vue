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
                <Customer-autocomplete v-model="task.customer" :showBtn="true"/>
              </v-col>
              <v-col :cols="12">
                <Agreement-autocomplete v-model="task.agreement" :showBtn="true"/>
              </v-col>
              <v-col :cols="12">
                <LoanAgreement-autocomplete v-model="task.loanAgreements" :showBtn="true"/>
              </v-col>
              <v-col :cols="12">
                <PledgeAgreement-autocomplete v-model="task.pledgeAgreements" :showBtn="true"/>
              </v-col>
            </v-row>
          </v-form>
        </v-card-item>

        <v-card-actions>
          <my-btn-submit
              text="Принять изменения"
              prepend-icon="mdi-content-save-edit-outline"
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
const updates = ref({});

onMounted(() => {
  handleFetchTask();
})

watch(task, (v) => {
  console.log('pledgeAgreements:', v.pledgeAgreements);
  if (v.title) updates.value.title = v.title;
  if (v.customer) updates.value.customerId = v.customer._id;
  if (v.agreement) updates.value.agreementId = v.agreement._id;
  if (v.loanAgreements) updates.value.loanAgreementsIds = v.loanAgreements.map(e => e._id);
  if (v.pledgeAgreements) updates.value.pledgeAgreementsIds = v?.pledgeAgreements?.map(e => e._id);

}, {deep: true});


async function handleUpdateTask() {

  const id = useRoute().params.taskId;
  if (!id) return;

  await form.value.validate();

  if (!formIsValid.value) {
    vuexStore.commit('alert/ERROR', 'Поля заполнены некорректно!');
    return;
  }

  loading.value = true;
  return updateTask(id, updates.value)
      .then((r) => successHandler(r, 'Документ успешно отредактирован', navigateBack))
      .catch(e => errorHandler(e, 'Ошибка редактирования'))
      .finally(finallyHandler)
}

function handleFetchTask() {
  loading.value = true;
  if (!useRoute().params.taskId) return;
  return fetchOneTask(useRoute().params.taskId)
      .then(r => successHandler(r, null, () => task.value = r.data || {}))
      .catch(e => errorHandler(e, 'Задание не существует или было удалено', navigateBack))
      .finally(finallyHandler)
}

function navigateBack() {
  navigateTo(`/manager/tasks`);
}

function clearFields() {
  task.value = {
    ...task.value,
    title: null,
    customer: null, // Заказчик
    agreement: null, // Договор
    loanAgreements: null, // Кредитный договор
    pledgeAgreements: null, // Договор залога
  }
}


function successHandler(r, msg, call) {
  if (msg) vuexStore.commit('alert/SUCCESS', msg);
  if (call) call();
  return r;
}

function errorHandler(e, msg, call) {
  console.log('Ошибка удаления записей', e);
  vuexStore.commit('alert/ERROR', msg || e.response?.data?.message || 'Неизвестная ошибка');
  if (call) call();
}

function finallyHandler() {
  loading.value = false;
}
</script>