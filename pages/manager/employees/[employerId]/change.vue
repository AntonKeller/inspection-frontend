<template>
  <v-container fluid>
    <v-sheet class="border rounded-lg bg-blue-lighten-5" max-width="1024">

      <v-card variant="text">
        <v-card-item>
          <v-btn
              v-bind="navigateBackBtnStyle"
              @click="navigateTo('/manager/employees')"
          >
            Назад
            <v-tooltip activator="parent" location="left">
              Вернуться назад
            </v-tooltip>
          </v-btn>
        </v-card-item>
      </v-card>

      <v-sheet class="bg-transparent">

      </v-sheet>

      <v-card :loading="loading" :disabled="loading" elevation="0" class="bg-transparent">

        <v-card-title>Редактирование сотрудника</v-card-title>

        <v-card-subtitle>Заполните поля</v-card-subtitle>

        <v-card-item>
          <v-form v-model="formIsValid" ref="form">
            <v-row>

              <v-col cols="12" lg="6">
                <v-sheet class="pl-5 pt-3 pr-5 border rounded-lg">
                  <v-label class="font-weight-bold pb-4">Личные данные</v-label>
                  <v-row dense>
                    <v-col cols="12" md="4" lg="6">
                      <v-text-field
                          v-model="employer.firstName"
                          v-bind="inputFieldStyle"
                          label="Имя"
                          :rules="[isNotEmptyRule]"
                      />
                    </v-col>
                    <v-col cols="12" md="4" lg="6">
                      <v-text-field
                          v-model="employer.surname"
                          v-bind="inputFieldStyle"
                          label="Фамилия"
                      />
                    </v-col>
                    <v-col cols="12" md="4" lg="12">
                      <v-text-field
                          v-model="employer.lastName"
                          v-bind="inputFieldStyle"
                          label="Отчество"
                      />
                    </v-col>
                  </v-row>
                </v-sheet>
              </v-col>

              <v-col cols="12" lg="6">
                <v-sheet class="pl-5 pt-3 pr-5 border rounded-lg">
                  <v-label class="font-weight-bold pb-4">Контактная информация</v-label>
                  <v-row dense>
                    <v-col cols="12" md="4" lg="6">
                      <v-text-field
                          v-model="employer.phoneNumberWork"
                          v-bind="inputFieldStyle"
                          v-maska="maskOptions"
                          label="Рабочий телефон"
                          placeholder="+7 (___) ___-__-__"
                      />
                    </v-col>
                    <v-col cols="12" md="4" lg="6">
                      <v-text-field
                          v-model="employer.phoneNumber"
                          v-bind="inputFieldStyle"
                          v-maska="maskOptions"
                          label="Личный телефон"
                          placeholder="+7 (___) ___-__-__"
                      />
                    </v-col>
                    <v-col cols="12" md="4" lg="12">
                      <v-text-field
                          v-model="employer.email"
                          v-bind="inputFieldStyle"
                          label="Email"
                      />
                    </v-col>
                  </v-row>
                </v-sheet>
              </v-col>

              <v-col cols="12">
                <v-sheet class="pl-5 pt-3 pr-5 border rounded-lg">
                  <v-label class="font-weight-bold pb-4">Системные реквизиты</v-label>
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <v-text-field
                          v-model="employer.role"
                          v-bind="inputFieldStyle"
                          label="Роль в системе"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                          v-model="employer.login"
                          v-bind="inputFieldStyle"
                          label="Логин"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                          v-model="employer.password"
                          v-bind="inputFieldStyle"
                          label="Пароль"
                      />
                    </v-col>
                  </v-row>
                </v-sheet>
              </v-col>

            </v-row>
          </v-form>
        </v-card-item>

        <v-card-actions>
          <my-btn-submit
              prepend-icon="mdi-checkbox-multiple-marked-outline"
              text="Принять изменения"
              :loading="loading"
              @click="handleUpdateEmployer"
          />
          <my-button-clear text="Очистить" @click="clearFields"/>
        </v-card-actions>
      </v-card>

    </v-sheet>
  </v-container>
</template>

<script setup>
import {navigateBackBtnStyle, inputFieldStyle} from "@/configs/styles";
import {isNotEmptyRule} from '@/utils/validators/functions';
import {vMaska} from "maska/vue";
import useEmployeesApi from "@/composables/use-employees-api";
import {useStore} from "vuex";


const vuexStore = useStore();
const employer = ref({});
const maskOptions = {
  mask: "+7 (###) ###-##-##",
  eager: true
}
const formIsValid = ref(false);
const form = ref();
const loading = ref(false);
const {
  fetchOne: fetchOneEmployer,
  update: updateEmployer
} = useEmployeesApi();


onMounted(() => {
  handleFetchEmployer(useRoute().params.employerId);
});


function handleFetchEmployer(id) {
  if (!id) return;
  loading.value = true;
  return fetchOneEmployer(id)
      .then((resp) => {
        employer.value = resp.data;
      })
      .catch(e => {
        console.log('Сотрудника не существует или он был удален', e);
        vuexStore.commit('alert/ERROR', 'Сотрудника не существует или он был удален')
      })
      .finally(() => {
        loading.value = false;
      });
}

async function handleUpdateEmployer() {

  const id = useRoute().params.employerId;
  if (!id) return;

  await form.value.validate();

  if (!formIsValid.value) {
    vuexStore.commit('alert/ERROR', 'Поля заполнены некорректно!');
    return;
  }

  loading.value = true;

  return updateEmployer(id, employer.value)
      .then(() => {
        vuexStore.commit('alert/SUCCESS', 'Документ успешно отредактирован');
        navigateTo('/manager/employees');
      })
      .catch(e => {
        console.log('Ошибка редактирования', e);
        vuexStore.commit('alert/ERROR', 'Ошибка редактирования');
      })
      .finally(() => loading.value = false)
}

function clearFields() {
  employer.value = {
    ...employer.value,
    firstName: null,
    surname: null,
    lastName: null,
    phoneNumberWork: null,
    phoneNumber: null,
    email: null,
    roleId: null,
  }
}
</script>