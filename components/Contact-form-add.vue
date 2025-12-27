<template>
  <v-sheet class="bg-grey-lighten-4 rounded-lg pa-1 ma-4 elevation-12" width="100vw" max-width="1024">

    <v-card-title class="d-flex align-center">
      Создание новый записи контакт
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

    <v-card-subtitle title="Заполните поля (сведения о контакте)"/>

    <v-card-item>
      <v-form v-model="formIsValid" ref="form">
        <v-row>
          <v-col cols="12">
            <v-sheet class="pa-4 border rounded-lg">
              <v-label class="font-weight-bold pb-4">Основные данные</v-label>
              <v-row dense>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col cols="12">
            <v-sheet class="pa-4 border rounded-lg">
              <v-label class="font-weight-bold pb-4">Основные данные</v-label>
              <v-row dense>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col cols="12">
            <v-sheet class="pa-4 border rounded-lg">
              <v-label class="font-weight-bold pb-4">Основные данные</v-label>
              <v-row dense>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
                <v-col cols="12"></v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
      </v-form>
    </v-card-item>

    <v-card-actions>
      <my-btn-submit
          text="Создать контакт"
          prepend-icon="mdi-checkbox-multiple-marked-outline"
          :loading="sending"
          @click="send"
      />
      <my-button-clear text="Очистить" @click="clear"/>
    </v-card-actions>
  </v-sheet>
</template>

<script>
import {isNotEmptyRule} from '@/utils/validators/functions.js';
import {addContact} from "../utils/api/api_contacts.js";
import {inputFieldStyle} from "@/configs/styles.js";

export default {
  name: "contactAdd",

  emits: ['add:success', 'click:close'],

  data() {
    return {
      contact: {
        _id: null,
        firstName: null,
        surname: null,
        lastName: null,
        phoneNumber: null,
      },
      sending: false,
      formIsValid: null,

      // import styles
      inputFieldStyle,
    }
  },

  methods: {

    isNotEmptyRule,

    async send() {

      await this.$refs.form.validate();

      if (!this.formIsValid) {
        this.$store.commit('alert/ERROR', 'Не все поля заполнены!');
        return;
      }

      this.sending = true;

      addContact(this.contact)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Контакт успешно добавлен');
            this.$emit('add:success');
          })
          .catch(err => {
            console.log('Ошибка добавления контакта', err);
            this.$store.commit('alert/ERROR', 'Ошибка добавления контакта');
          })
          .finally(() => {
            this.sending = false;
          })
    },

    clear() {
      this.contact = {
        _id: null,
        firstName: null,
        surname: null,
        lastName: null,
        phoneNumber: null,
      }
    }
  }
}
</script>