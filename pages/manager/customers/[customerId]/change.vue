<template>
  <v-container fluid>
    <v-card variant="text">
      <v-card-item>
        <v-btn
            v-bind="navigateBackBtnStyle"
            @click="navigateTo(`/manager/customers`)"
        >
          Назад
          <v-tooltip activator="parent" location="left">
            Вернуться назад
          </v-tooltip>
        </v-btn>
      </v-card-item>
    </v-card>

    <v-sheet
        class="bg-grey-lighten-4 rounded-lg pa-1 mx-4 elevation-12 border"
        width="100vw"
        max-width="1280"
    >

      <v-card-title title="Редактор заказчика" />
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
            prepend-icon="mdi-checkbox-multiple-marked-outline"
            text="Принять изменения"
            :loading="loading"
            @click="handleUpdateCustomer"
        />
        <my-button-clear
            text="Очистить"
            @click="clearFields"
        />
      </v-card-actions>
    </v-sheet>
  </v-container>
</template>

<script setup>
import {navigateBackBtnStyle, inputFieldStyle} from "@/configs/styles";
import {isINN, isNotEmptyRule} from "@/utils/validators/functions";
import {navigateTo} from "nuxt/app";
import {vMaska} from "maska/vue"
import useCustomersApi from "@/composables/use-customers-api";
import {useStore} from "vuex";


const vuexStore = useStore();
const options = {
  mask: "+7 (###) ###-##-##",
  eager: true
}
const customer = ref({});
const loading = ref(false);
const formIsValid = ref(false);
const form = ref();
const {
  fetchOne: fetchOneCustomer,
  update: updateCustomer
} = useCustomersApi();


onMounted(() => {
  handleFetchCustomer(useRoute().params.customerId);
});


function handleFetchCustomer(id) {
  if (!id) return;
  loading.value = true;
  return fetchOneCustomer(id)
      .then((resp) => {
        customer.value = resp.data;
      })
      .catch(e => {
        console.log('Заказчика не существует или он был удален', e);
        vuexStore.commit('alert/ERROR', 'Заказчика не существует или он был удален')
      })
      .finally(() => {
        loading.value = false;
      });
}

async function handleUpdateCustomer() {

  const id = useRoute().params.customerId;
  if (!id) return;

  await form.value.validate();

  if (!formIsValid.value) {
    vuexStore.commit('alert/ERROR', 'Поля заполнены некорректно!');
    return;
  }

  loading.value = true;

  return updateCustomer(id, customer.value)
      .then(() => {
        vuexStore.commit('alert/SUCCESS', 'Запись о заказчике изменена');
        navigateTo(`/manager/customers`);
      })
      .catch(err => {
        console.log('Ошибка изменения данных заказчика', err);
        vuexStore.commit('alert/ERROR', 'Ошибка изменения записи о заказчике');
      })
      .finally(() => {
        this.loading = false;
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