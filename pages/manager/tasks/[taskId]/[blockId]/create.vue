<template>
  <v-container fluid>
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

      <v-card variant="text">

        <v-card-title>Новый адрес ТЗ</v-card-title>
        <v-card-subtitle>Заполните поля</v-card-subtitle>

        <v-card-item>
          <v-form v-model="formIsValid" ref="form" class="mt-2">
            <v-row dense>
              <v-col :cols="12">
                <v-text-field
                    v-model="block.title"
                    v-bind="inputFieldStyle"
                    label="Заголовок"
                />
              </v-col>

              <v-col :cols="6">
                <myAutocompletePledgers v-model="block.pledger"/>
              </v-col>

              <v-col :cols="6">
                <my-date-picker v-model="block.startDate" label="Дата начала"/>
              </v-col>

              <v-col :cols="12">
                <v-text-field
                    v-model="block.address"
                    v-bind="inputFieldStyle"
                    label="Адрес осмотра"
                    :rules="[isNotEmptyRule]"
                />
              </v-col>

              <v-col :cols="6">
                <myAutocompleteContacts v-model="block.contact"/>
              </v-col>

              <v-col :cols="6">
                <myAutocompleteInspectors v-model="block.inspector"/>
              </v-col>
            </v-row>
          </v-form>
        </v-card-item>

        <v-card-actions>
          <my-btn-submit
              text="Добавить"
              prepend-icon="mdi-checkbox-multiple-marked-outline"
              :loading="sendingAssignmentBlock"
              @click="sendBlock"
          />
          <my-button-clear text="Очистить" @click="clear"/>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {sendAssignmentBlock} from "@/utils/api/api_assignment_blocks";
import {isNotEmptyRule} from '@/utils/validators/functions'
import {navigateBackBtnStyle, inputFieldStyle} from "@/configs/styles";
import {navigateTo} from "nuxt/app";
import {vMaska} from "maska/vue"

export default {
  name: "block-add",

  directives: {
    mask: vMaska
  },

  data() {
    return {

      block: {
        _id: null,
        title: null, // Заголовок
        address: null, // Адрес
        startDate: null, // Дата начала
        pledger: null, // Залогодатель
        contact: null, // Контакт
        inspector: null, // Инспектор
      },

      formIsValid: null,
      sendingAssignmentBlock: false,

      options: {
        mask: "+7 (###) ###-##-##",
        eager: true
      },

      // import styles
      inputFieldStyle,
      navigateBackBtnStyle
    }
  },

  mounted() {
    this.clear();
  },

  methods: {

    isNotEmptyRule,

    clear() {
      this.block = {
        _id: null,
        title: null, // Заголовок
        address: null, // Адрес
        startDate: null, // Дата начала
        pledger: null, // Залогодатель
        contact: null, // Контакт
        inspector: null, // Инспектор
      }
    },

    navigateBack() {
      navigateTo('/manager-menu/assignments/assignment');
    },

    async sendBlock() {

      await this.$refs.form.validate();

      if (!this.formIsValid) {
        this.$store.commit('alert/ERROR', 'Заполните обязательные поля!');
        return;
      }

      if (!this.$store.getters['assignments/SELECTED']?._id) {
        this.$store.commit('alert/ERROR', 'Не выбранно задание для добавления блока');
        return;
      }

      this.sendingAssignmentBlock = true;

      sendAssignmentBlock(this.$store.getters['assignments/SELECTED']._id, this.block)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Адрес осмотра успешно создан');
            this.navigateBack();
          })
          .catch((err) => {
            this.$store.commit('alert/ERROR', 'Ошибка добавления адреса осмотра');
            console.log('Ошибка добавления', err);
          })
          .finally(() => {
            this.sendingAssignmentBlock = false;
          })
    }
  }
}
</script>