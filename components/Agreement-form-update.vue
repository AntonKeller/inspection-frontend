<template>
  <v-card :sending="sending" :disabled="sending" elevation="6" width="100vw" max-width="800">
    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div>{{ cardTitle }}</div>
        <my-button-close-card @click="$emit('click:close')" class="align-self-start"/>
      </div>
    </v-card-title>

    <v-card-subtitle>
      Заполните поля
    </v-card-subtitle>

    <v-card-text>
      <v-form v-model="formIsValid" ref="form" class="mt-2">
        <v-row dense>
          <v-col :cols="12">
            <v-text-field
                v-model="contract.number"
                v-bind="inputFieldStyle"
                prepend-inner-icon="mdi-file-sign"
                :label="placeHolderContract"
                placeholder="xxxxxx/xxxxx xxxx.xxxxx"
            />
          </v-col>

          <v-col :cols="12" :md="8">
            <my-date-picker
                v-model="contract.date"
                prepend-inner-icon="mdi-calendar-range"
                label="Дата заключения"
                placeholder="дд:мм:гггг"
            />
          </v-col>

          <v-col :cols="12" :md="4">
            <v-switch
                v-model="hideParent"
                density="compact"
                label="Рамочный договор"
                color="primary"
                class="pl-4"
                disabled
            />
          </v-col>

          <v-col :cols="12" v-if="!hideParent">
            <Transition>
              <Agreement-autocomplete
                  v-model="contract.parent"
                  label="Рамочный договор"
                  hideButtonAdd
              />
            </Transition>
          </v-col>

          <v-col :cols="12">
            <v-textarea
                v-model="contract.description"
                variant="outlined"
                density="compact"
                label="Описание"
                rows="5"
                no-resize
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <my-btn-submit text="Принять" :sending="sending" @click="send"/>
      <my-button-clear text="Очистить" @click="clear"/>
    </v-card-actions>
  </v-card>
</template>

<script>
import {changeContract} from "../utils/api/api_contracts.js";
import {inputFieldStyle} from "@/configs/styles.js";
import _ from "lodash";

export default {
  name: "contractChange",

  emits: ['change:success', 'click:close'],

  props: {
    _contract: Object,
  },

  beforeMount() {
    this.contract = _.cloneDeep(this._contract);
  },

  data() {
    return {
      contract: {
        _id: null,
        number: null,
        date: null,
        parent: null,
        description: null,
      },

      hideParent: false,
      formIsValid: null,
      sending: false,

      // import styles
      inputFieldStyle,
    }
  },

  computed: {

    cardTitle() {
      return this.hideParent ? 'Редактирование рамочного договора' : 'Редактирование ТЗ к договору';
    },

    placeHolderContract() {
      return this.hideParent ? 'Номер рамочного договора' : 'Номер ТЗ к договору';
    }

  },

  methods: {
    async send() {

      await this.$refs.form.validate();

      if (!this.formIsValid) {
        this.$store.commit('alert/ERROR', 'Не все поля заполнены!');
        return;
      }

      this.sending = true;

      changeContract(this.contract)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Договор успешно изменен!');
            this.$emit('change:success');
          })
          .catch(err => {
            this.$store.commit('alert/ERROR', 'Ошибка изменения договора!');
            console.log('Ошибка добавления договора', err);
          })
          .finally(() => {
            this.sending = false;
          })
    },

    clear() {
      this.contract = {
        _id: null,
        number: null,
        date: null,
        parent: null,
        description: null,
      }
    }
  }
}
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>