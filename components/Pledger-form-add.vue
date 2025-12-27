<template>
  <v-card :loading="sending" :disabled="sending" elevation="6" width="100vw" max-width="800">
    <v-card-title class="d-flex align-center">
      Создание новый записи залогодатель
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
    <v-card-subtitle>
      Заполните поля (сведения о залогодателе)
    </v-card-subtitle>
    <v-card-item>
      <v-form v-model="formIsValid" ref="form" class="d-flex flex-column mt-2">
        <v-row dense>
          <v-col :cols="12">
            <v-text-field
                v-model="pledger.firstName"
                v-bind="inputFieldStyle"
                :rules="[isNotEmptyRule]"
                label="Имя"
            />
          </v-col>
          <v-col :cols="12">
            <v-text-field
                v-model="pledger.surname"
                v-bind="inputFieldStyle"
                label="Фамилия"
            />
          </v-col>
          <v-col :cols="12">
            <v-text-field
                v-model="pledger.lastName"
                v-bind="inputFieldStyle"
                label="Отчество"
            />
          </v-col>
          <v-col :cols="12">
            <v-text-field
                v-model="pledger.inn"
                v-bind="inputFieldStyle"
                label="ИНН"
                :rules="[isINN]"
            />
          </v-col>
          <v-col :cols="12">
            <v-text-field
                v-model="pledger.position"
                v-bind="inputFieldStyle"
                label="Должность"
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
          @click="send"
      />
      <my-button-clear text="Очистить" @click="clear"/>
    </v-card-actions>
  </v-card>
</template>

<script>
import {isINN, isNotEmptyRule} from '@/utils/validators/functions.js';
import {addPledger} from "../utils/api/api_pledgers.js";
import {inputFieldStyle} from "@/configs/styles.js";

export default {
  name: "pledgerAdd",

  emits: ['add:success', 'click:close'],

  data() {
    return {
      pledger: {
        _id: null,
        firstName: null,
        surname: null,
        lastName: null,
        inn: null,
        position: null,
      },
      formIsValid: null,
      sending: false,

      // import styles
      inputFieldStyle,
    }
  },

  methods: {

    isNotEmptyRule,
    isINN,

    async send() {

      await this.$refs.form.validate();

      if (!this.formIsValid) {
        this.$store.commit('alert/ERROR', 'Заполните обязательные поля!');
        return;
      }

      this.sending = true;

      addPledger(this.pledger)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Залогодатель успешно добавлен');
            this.$emit('add:success');
          })
          .catch((err) => {
            console.log('Ошибка добавления нового залогодателя', err);
            this.$store.commit('alert/ERROR', 'Ошибка добавления залогодателя!');
          })
          .finally(() => {
            this.sending = false;
          });
    },

    clear() {
      this.pledger = {
        _id: null,
        firstName: null,
        surname: null,
        lastName: null,
        inn: null,
        position: null,
      }
    }
  }
}
</script>