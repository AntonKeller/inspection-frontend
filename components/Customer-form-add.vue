<template>
  <v-sheet
      class="bg-grey-lighten-4 rounded-lg pa-1 mx-4 elevation-12"
      width="100vw"
      max-width="1280"
  >

    <v-card-title class="d-flex align-center">
      Создание новой записи о заказчике
      <v-btn
          density="comfortable"
          class="ml-auto"
          variant="text"
          size="small"
          icon=""
          @click="$emit('click:close')"
      >
        <v-icon icon="mdi-close"/>
        <v-tooltip activator="parent">Закрыть окно</v-tooltip>
      </v-btn>
    </v-card-title>

    <v-card-subtitle title="Заполните сведения о заказчике/организации)"/>

    <v-sheet class="pa-4 overflow-y-scroll bg-transparent" max-height="600">
      <v-form v-model="formIsValid" ref="form">
        <v-row>
          <v-col cols="12">
            <v-sheet class="pa-4 border rounded-lg">
              <v-label class="font-weight-bold pb-4">Основные данные</v-label>
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                      v-model="customer.fullName"
                      v-bind="inputFieldStyle"
                      label="Полное наименование организации"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                      v-model="customer.shortName"
                      v-bind="inputFieldStyle"
                      label="Краткое наименование организации"
                  />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                      v-model="customer.memberFullName"
                      v-bind="inputFieldStyle"
                      label="ФИО представителя"
                  />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                      v-model="customer.memberPosition"
                      v-bind="inputFieldStyle"
                      label="Должность представителя"
                  />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col cols="12" lg="6">
            <v-sheet class="pa-4 border rounded-lg">
              <v-label class="font-weight-bold pb-4">Контакты</v-label>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="customer.email"
                      v-bind="inputFieldStyle"
                      label="Email организации"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="customer.phoneNumber"
                      v-bind="inputFieldStyle"
                      v-maska="options"
                      label="Номер организации"
                      placeholder="+7 (___) ___-__-__"
                  />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col cols="12" lg="6">
            <v-sheet class="pa-4 border rounded-lg">
              <v-label class="font-weight-bold pb-4">Регистрационные данные</v-label>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="customer.inn"
                      v-bind="inputFieldStyle"
                      label="ИНН организации"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                      v-model="customer.ogrn"
                      v-bind="inputFieldStyle"
                      label="ОГРН организации"
                  />
                </v-col>
                <v-col cols="12" md="6" lg="12">
                  <v-text-field
                      v-model="customer.legalAddress"
                      v-bind="inputFieldStyle"
                      label="Юридический адрес"
                  />
                </v-col>
                <v-col cols="12" md="6" lg="12">
                  <v-text-field
                      v-model="customer.physicalAddress"
                      v-bind="inputFieldStyle"
                      label="Фактический адрес"
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
          text="Создать нового заказчика"
          prepend-icon="mdi-checkbox-multiple-marked-outline"
          :loading="loading"
          @click="handleCreate"
      />
      <my-button-clear text="Очистить" @click="clearFields"/>
    </v-card-actions>
  </v-sheet>
</template>

<script setup>
import {inputFieldStyle} from "@/configs/styles";
import {useStore} from "vuex";
import useCustomersApi from "@/composables/use-customers-api";
import {vMaska} from "maska/vue"


const emit = defineEmits(['create:success', 'create:error', 'click:close']);


const vuexStore = useStore();
const customer = ref({
  shortName: null,       // - Краткое наименование - строка
  fullName: null,        // - Полное наименование - строка
  inn: null,             // - ИНН организации - строка
  ogrn: null,            // - ОГРН организации - строка
  legalAddress: null,    // - Юридический адрес - строка
  physicalAddress: null, // - Фактический адрес - строка
  email: null,           // - Email
  phoneNumber: null,     // - Номер телефона заказчика
  memberFullName: null,  // - ФИО представителя
  memberPosition: null,  // - Должность представителя
});
const loading = ref(false);
const form = ref();
const formIsValid = ref(false);
const {
  create: createCustomer
} = useCustomersApi();


async function handleCreate() {
  await form.value.validate();
  if (!formIsValid.value) return;
  loading.value = true;
  return createCustomer(customer.value)
      .then(resp => {
        emit('create:success', resp.data || null);
        vuexStore.commit('alert/SUCCESS', 'Заказчик успешно создан');
        return resp;
      })
      .catch(e => {
        emit('create:error', null);
        console.log('Ошибка создания записи', e);
        vuexStore.commit('alert/ERROR', e?.response?.data?.message || 'Ошибка создания записи');
      })
      .finally(() => {
        loading.value = false;
      });
}


function clearFields() {
  customer.value = {
    ...customer.value,
    shortName: null,
    fullName: null,
    inn: null,
    ogrn: null,
    legalAddress: null,
    physicalAddress: null,
    email: null,
    phoneNumber: null,
    memberFullName: null,
    memberPosition: null,
  }
}

</script>