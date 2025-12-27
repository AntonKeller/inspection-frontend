<template>
  <div class="d-flex ga-1">
    <v-text-field
        v-model="textField"
        placeholder="дд:мм:гггг"
        variant="solo-filled"
        ref="dateInput"
        label="Дата"
        flat
        clearable
        :rules="[v => textDateValid(v)]"
        @input="onInput"
        v-bind="{...inputFieldStyle, ...$attrs}"
    >
    </v-text-field>
    <v-btn
        border="dashed"
        class="border"
        icon=""
        size="small"
        color="grey-darken-2"
        variant="text"
        rounded="lg"
        @click.stop="isVisibleMenu=true"
    >
      <v-icon icon="mdi-calendar-range"/>
      <v-tooltip activator="parent" location="right" text="Календарь"/>
      <v-menu v-if="isVisibleMenu" v-model="isVisibleMenu" activator="parent" location="bottom right">
        <v-date-picker
            v-model="datepickerValue"
            @update:modelValue="datePickerUpdateValue"
            title="Дата"
            hide-header
            @click.stop
            class="rounded-lg mt-1"
            border
        />
      </v-menu>
    </v-btn>
  </div>
</template>

<script>
import moment from 'moment';
import {inputFieldStyle} from "@/configs/styles";

export default {
  inheritAttrs: false,

  name: "my-date-picker",

  props: ['modelValue', 'fieldWidth'],

  emits: ['update:modelValue'],

  data() {
    return {
      unixDate: null,
      textFieldValue: null,
      datepickerValue: null,
      isVisibleMenu: false,
      inputFieldStyle
    }
  },

  watch: {
    modelValue() {
      if (this.modelValue === null || this.modelValue === undefined) {
        this.datepickerValue = null;
        this.unixDate = null;
        this.textFieldValue = null;
      } else if (!isNaN(parseInt(this.modelValue))) {
        this.textFieldValue = moment(parseInt(this.modelValue)).format('DD.MM.YYYY');
        this.unixDate = this.modelValue;
      }
    },
    unixDate(value) {
      this.$emit('update:modelValue', value);
    },
    textFieldValue(value) {
      if (value === null) {
        this.unixDate = null;
      }
    }
  },

  beforeMount() {
    if (!isNaN(parseInt(this.modelValue))) {
      this.textFieldValue = moment(parseInt(this.modelValue)).format('DD.MM.YYYY');
      this.unixDate = this.modelValue;
    }
  },

  computed: {
    textField: {
      get() {
        return this.textFieldValue;
      },
      set(v) {

        const expA = [
          /^(\d\d)(\d)$/i,
          /^(\d\d\.\d\d)(\d)$/i
        ].find(exp => exp.test(v));

        if (expA) {
          this.textFieldValue = v.replace(expA, '$1.$2');
          return;
        }

        const expB = [
          /^(\d{2})\.$/i,
          /^(\d\d\.\d\d)\.$/i,
          /^(\d\d\.\d\d\.\d\d\d\d).*/i
        ].find(exp => exp.test(v));

        if (expB) {
          this.textFieldValue = v.replace(expB, '$1');
          return;
        }

        this.textFieldValue = v;
      }
    }
  },

  methods: {

    setDateNow() {
      const now = new Date(); // Текущая дата и время
      now.setHours(0, 0, 0, 0); // Устанавливаем время на 00:00:00
      this.unixDate = now.getTime(); // Получаем timestamp на 00:00
    },

    datePickerUpdateValue(value) {
      this.textFieldValue = moment(value).format('DD.MM.YYYY');
      this.unixDate = moment(value).unix() * 1000;
      this.isVisibleMenu = false;
    },

    // Валидация текстовой даты (Text filed) -> возвращает true/false
    momentCheckDate(stringDate) {
      return moment(stringDate, 'DD.MM.YYYY', 'ru', true).isValid();
    },

    // Валидация текстовой даты (Text filed) -> возвращает сообщение об ошибке
    textDateValid(textDate) {
      return !textDate || this.momentCheckDate(textDate) || 'Некорректная дата';
    },

    // Ограничивает ввод
    onInput() {

      const rules = [
        /^[0-3]/i,
        /^(0[1-9]|1\d|2\d|30|31)/i,
        /^(0[1-9]|1\d|2\d|30|31)\./i,
        /^(0[1-9]|1\d|2\d|30|31)\.[0-1]/i,
        /^(0[1-9]|1\d|2\d|30|31)\.(0[1-9]|1[0-2])/i,
        /^(0[1-9]|1\d|2\d|30|31)\.(0[1-9]|1[0-2])\./i,
        /^(0[1-9]|1\d|2\d|30|31)\.(0[1-9]|1[0-2])\.\d/i,
        /^(0[1-9]|1\d|2\d|30|31)\.(0[1-9]|1[0-2])\.\d\d/i,
        /^(0[1-9]|1\d|2\d|30|31)\.(0[1-9]|1[0-2])\.\d\d\d/i,
        /^(0[1-9]|1\d|2\d|30|31)\.(0[1-9]|1[0-2])\.\d\d\d\d$/i,
      ];

      const textDate = this.textField;
      const foundIndexLastValid = rules.reverse().findIndex(exp => exp.test(textDate));

      if (foundIndexLastValid !== undefined) {
        const slice = textDate.match(rules[foundIndexLastValid])?.shift();
        this.$refs.dateInput.value = slice;
        this.textFieldValue = slice;
        if (this.momentCheckDate(textDate)) {
          this.unixDate = moment(textDate, 'DD.MM.YYYY', 'ru', true).unix() * 1000;
        }
      } else {
        this.$refs.dateInput.value = '';
        this.textFieldValue = '';
      }

      if (this.isVisibleMenu) this.isVisibleMenu = false;
    }
  }
}
</script>