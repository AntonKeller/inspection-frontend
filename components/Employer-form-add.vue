<template>
  <v-sheet
      class="bg-grey-lighten-4 rounded-lg pa-1 mx-4 elevation-12"
      width="100vw"
      max-width="1024"
  >
    <!--    TODO: Закончить форму добавления сотрудника -->
  </v-sheet>


  <v-container fluid>
    <v-sheet>
      <v-card :loading="sending" :disabled="sending" elevation="0" width="100vw" max-width="800">

        <v-card-title class="d-flex align-center">
          Добавление нового инспектора
          <v-btn
              density="comfortable"
              class="ml-auto"
              variant="text"
              size="small"
              icon=""
              @click="$emit('close')"
          >
            <v-icon icon="mdi-close"/>
            <v-tooltip activator="parent">Закрыть окно</v-tooltip>
          </v-btn>
        </v-card-title>

        <v-card-subtitle>Заполните поля</v-card-subtitle>

        <v-card-item>
          <v-form v-model="formIsValid" ref="form" class="mt-2">
            <v-row dense>
              <v-col :cols="12">
                <v-text-field
                    v-model="inspector.firstName"
                    v-bind="inputFieldStyle"
                    label="Имя"
                    :rules="[isNotEmptyRule]"/>
              </v-col>
              <v-col :cols="12">
                <v-text-field
                    v-model="inspector.surname"
                    v-bind="inputFieldStyle"
                    label="Фамилия"
                />
              </v-col>
              <v-col :cols="12">
                <v-text-field
                    v-model="inspector.lastName"
                    v-bind="inputFieldStyle"
                    label="Отчество"
                />
              </v-col>
              <v-col :cols="6">
                <v-text-field
                    v-model="inspector.phoneNumber"
                    v-bind="inputFieldStyle"
                    v-mask="options"
                    label="Номер телефона"
                    placeholder="+7 (___) ___-__-__"
                />
              </v-col>
              <v-col :cols="6">
                <v-text-field
                    v-model="inspector.email"
                    v-bind="inputFieldStyle"
                    label="Email"
                />
              </v-col>
              <v-col :cols="12">
                <v-text-field
                    v-model="inspector.login"
                    v-bind="inputFieldStyle"
                    label="Логин"
                />
              </v-col>
              <v-col :cols="12">
                <v-text-field
                    v-model="inspector.password"
                    v-bind="inputFieldStyle"
                    label="Пароль"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-item>

        <v-card-actions>
          <my-btn-submit
              text="Добавить"
              prepend-icon="mdi-checkbox-multiple-marked-outline"
              :loading="sending"
              @click="addInspector"
          />
          <my-button-clear text="Очистить" @click="clear"/>
        </v-card-actions>
      </v-card>

    </v-sheet>
  </v-container>
</template>

<script>
import {navigateBackBtnStyle, inputFieldStyle} from "@/configs/styles.js";
import {addInspector} from "../utils/api/api_inspectors.js";
import {isNotEmptyRule} from '@/utils/validators/functions.js';
import {vMaska} from "maska/vue"

export default {
  name: "inspector-add",

  emits: ['add:success', 'close'],

  directives: {
    mask: vMaska
  },

  data() {
    return {
      inspector: {
        _id: null,
        firstName: null,
        surname: null,
        lastName: null,
        phoneNumber: null,
        email: null,
        login: null,
        password: null,
      },

      options: {
        mask: "+7 (###) ###-##-##",
        eager: true
      },

      formIsValid: false,
      sending: false,

      // import styles
      inputFieldStyle,
      navigateBackBtnStyle
    }
  },

  methods: {

    isNotEmptyRule,

    async addInspector() {

      await this.$refs.form.validate();

      if (!this.formIsValid) {
        this.$store.commit('alert/ERROR', 'Не все поля заполнены');
        return;
      }

      this.sending = true;

      addInspector(this.inspector)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Инспектор успешно добавлен');
            this.$emit('add:success');
          })
          .catch((err) => {
            console.log('Ошибка добавление инспектора', err);
            this.$store.commit('alert/ERROR', 'Ошибка добавление инспектора');
          })
          .finally(() => {
            this.sending = false;
          })
    },

    clear() {
      this.inspector = {
        _id: this.inspector._id,
        firstName: null,
        surname: null,
        lastName: null,
        phoneNumber: null,
        email: null,
        login: null,
        password: null,
      }
    }
  }
}
</script>