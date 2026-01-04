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

        <v-card-title>Редактирование адреса ТЗ</v-card-title>

        <v-card-subtitle>Заполните поля</v-card-subtitle>

        <v-card-item>
          <v-form v-model="formIsValid" ref="form" class="d-flex flex-column mt-2">
            <v-row dense>

              <v-col cols="12" md="6">
                <v-text-field v-model="address.title" v-bind="inputFieldStyle" label="Заголовок"/>
              </v-col>

              <v-col cols="12" md="6">
                <my-date-picker v-model="address.startDate" label="Дата начала осмотра"/>
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="address.address" v-bind="inputFieldStyle" label="Адрес осмотра"/>
              </v-col>

              <v-col cols="6">
                <EmployerAutocomplete v-model="address.address" label="Исполнитель (Инспектор)"/>
              </v-col>

              <v-col cols="6">

              </v-col>

              <v-col cols="12">

              </v-col>

              <!--            TODO: СДелать autocomplete для контактов и для залогодателей + формы добавления-->
              <!--            contactId-->
              <!--            pledgerId-->
              <!--            <v-col cols="6">-->
              <!--              <myAutocompletePledgers v-model="address.pledger"/>-->
              <!--            </v-col>-->

              <!--            <v-col cols="6">-->
              <!--              <myAutocompleteContacts v-model="address.contact"/>-->
              <!--            </v-col>-->

              <!--            <v-col cols="6">-->
              <!--              <myAutocompleteInspectors v-model="address.inspector"/>-->
              <!--            </v-col>-->

            </v-row>
          </v-form>
        </v-card-item>

        <v-card-actions>
          <my-btn-submit
              text="Принять изменения"
              prepend-icon="mdi-content-save-edit-outline"
              :loading="loading"
              @click="sendChanges"
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
import useTargetAddressesApi from "@/composables/use-target-addresses-api.ts";


const {fetchOne: fetchOneAddress, update: updateOneAddress} = useTargetAddressesApi();
const vuexStore = useStore();
const address = ref({});
const formIsValid = ref(false);
const form = ref();
const loading = ref(false);
const updates = ref({});


onMounted(async () => {
  await handleFetchTask(useRoute().params.addressId)
      .then(r => successHandler(r, null, () => address.value = r.data || {}))
      .catch(e => errorHandler(e, 'Адрес не существует или был удален', navigateBack))
      .finally(finallyHandler)
});


async function sendChanges() {

  await form.value.validate();

  if (!formIsValid.value) {
    vuexStore.commit('alert/ERROR', 'Поля заполнены некорректно!');
    return;
  }

  loading.value = true;
  const id = useRoute().params.addressId;
  return updateOneAddress(id, updates.value)
      .then((r) => successHandler(r, 'Документ успешно отредактирован', navigateBack))
      .catch(e => errorHandler(e, 'Ошибка редактирования'))
      .finally(finallyHandler)
}

function handleFetchTask(id) {
  loading.value = true;
  return fetchOneAddress(id)
}

function navigateBack() {
  return navigateTo(`/manager/tasks/${useRoute().params.taskId}/`);
}

function clearFields() {
  address.value = {
    ...address.value,
    title: null,
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