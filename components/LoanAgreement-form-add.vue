<template>
  <v-sheet
      class="bg-grey-lighten-4 rounded-lg pa-1 mx-4 elevation-12"
      width="100vw"
      max-width="1024"
  >

    <v-card-title class="d-flex align-center">
      Создание новой записи о кредитном договоре
      <v-btn
          v-tooltip="'Закрыть окно'"
          density="comfortable"
          class="ml-auto"
          variant="text"
          size="small"
          icon=""
          @click="closeForm"
      >
        <v-icon icon="mdi-close"/>
      </v-btn>
    </v-card-title>

    <v-card-subtitle title="Заполните сведения о кредитном договоре"/>

    <v-sheet class="pa-4 overflow-y-scroll bg-transparent" max-height="600">
      <v-form v-model="formIsValid" ref="form">
        <v-row>
          <v-col cols="12">
            <v-sheet class="pa-4 border rounded-lg">
              <v-label class="font-weight-bold pb-4">Основные данные</v-label>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                      v-model="loanAgreement.number"
                      v-bind="inputFieldStyle"
                      label="Номер кредитного договора"
                      prepend-inner-icon="mdi-label-variant-outline"
                  />
                </v-col>
                <v-col cols="12">
                  <my-date-picker
                      v-model="loanAgreement.date"
                      label="Дата кредитного договора"
                  />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
      </v-form>
    </v-sheet>

    <v-card-actions>
      <my-btn-submit
          text="Создать новый кредитный договор"
          prepend-icon="mdi-checkbox-multiple-marked-outline"
          :loading="loading"
          @click="createLoanAgreement"
      />
      <my-button-clear text="Очистить" @click="clearFields"/>
    </v-card-actions>
  </v-sheet>
</template>

<script setup>
import {inputFieldStyle} from "@/configs/styles";
import useLoanAgreementsApi from "@/composables/use-loan-agreements-api.ts";
import {useStore} from "vuex";


const emit = defineEmits([
  'success',
  'close'
]);


const vuexStore = useStore();
const loanAgreement = ref({
  number: null,
  date: null,
});
const loading = ref(false);
const form = ref(null);
const formIsValid = ref(false);
const {create} = useLoanAgreementsApi();


async function createLoanAgreement() {
  await form.value.validate();
  if (!formIsValid.value) return;
  loading.value = true;
  return create(loanAgreement.value)
      .then((r) => successHandler(r, 'Документ успешно создан', successAndClose))
      .catch((e) => errorHandler(e, 'Ошибка создания документа'))
      .finally(finallyHandler)
}

function clearFields() {
  loanAgreement.value = {
    number: null,
    date: null,
  };
}

function successAndClose() {
  emit('success');
  closeForm();
}

function closeForm() {
  emit('close');
}


function successHandler(r, msg, call) {
  if (msg) vuexStore.commit('alert/SUCCESS', msg);
  if (call) call();
  return r;
}

function errorHandler(e, msg, call) {
  console.log('Ошибка удаления', e);
  vuexStore.commit('alert/ERROR', msg || e.response?.data?.message || 'Неизвестная ошибка');
  if (call) call();
}

function finallyHandler() {
  loading.value = false;
}
</script>