<template>
  <v-sheet class="bg-grey-lighten-4 rounded-lg pa-1 ma-4 elevation-12" width="100vw" max-width="1024">

    <v-card-title class="d-flex align-center">
      {{ title }}
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

    <v-card-subtitle title="Заполните поля"/>

    <v-sheet class="pa-4 overflow-y-scroll bg-transparent" max-height="600">
      <v-form v-model="formIsValid" ref="form">
        <v-row>
          <v-col cols="12">
            <v-sheet class="pa-4 border rounded-lg">
              <v-label class="font-weight-bold pb-4">Основные данные</v-label>
              <v-row dense>
                <v-col cols="12" :lg="!agreement.isParent ? 4 : 12">
                  <v-switch
                      v-model="agreement.isParent"
                      density="compact"
                      :label="agreement.isParent ? 'Является договором' : 'Является заданием'"
                      color="primary"
                      class="pl-4"
                  />
                </v-col>
                <v-col cols="12" lg="8" v-if="!agreement.isParent">
                  <Agreement-autocomplete
                      v-model="agreement.parent"
                      :filter="e => e.isParent === true"
                      label="Включается в договор"
                      hideButtonAdd
                  />
                </v-col>
                <v-col cols="12" lg="6">
                  <v-text-field
                      v-model="agreement.number"
                      v-bind="inputFieldStyle"
                      prepend-inner-icon="mdi-file-sign"
                      :label="numberLabel"
                      placeholder="Номер договора"
                  />
                </v-col>
                <v-col cols="12" lg="6">
                  <my-date-picker
                      v-model="agreement.date"
                      prepend-inner-icon="mdi-calendar-range"
                      label="Дата заключения"
                      placeholder="дд:мм:гггг"
                  />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col cols="12">
            <v-sheet class="pa-4 border rounded-lg">
              <v-label class="font-weight-bold pb-4">Дополнительная информация</v-label>
              <v-row dense>
                <v-col cols="12">
                  <v-textarea
                      v-model="agreement.description"
                      v-bind="inputFieldStyle"
                      label="Описание"
                      row-height="15"
                      rows="6"
                      variant="outlined"
                      auto-grow
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
          :text="agreement.isParent ? 'Создать новый договор' : 'Создать новое задание'"
          :sending="loading"
          @click="handleCreate"
      />
      <my-button-clear
          text="Очистить поля"
          @click="clearFields"
      />
    </v-card-actions>
  </v-sheet>
</template>

<script setup>
import {inputFieldStyle} from "@/configs/styles";
import useAgreementsApi from "@/composables/use-agreements-api";
import {useStore} from "vuex";


const emit = defineEmits(['create:success', 'create:error', 'click:close']);


const vuexStore = useStore();
const agreement = ref({
  number: null,
  date: null,
  isParent: null,
  description: null,
  parent: null,
});
const loading = ref(false);
const form = ref();
const formIsValid = ref(false);
const {
  create: createAgreement
} = useAgreementsApi();


const title = computed(() => agreement.value.isParent ? 'Новый договор' : 'Новое задание к договору');
const numberLabel = computed(() => agreement.value.isParent ? 'Номер договора' : 'Номер задания к договору');


watch(agreement, (val, oldVal) => {
  if (!oldVal.isParent && val.isParent) {
    agreement.value.parent = null;
  }
});


async function handleCreate() {
  await form.value.validate();
  if (!formIsValid.value) return;
  loading.value = true;
  const {parent, ...other} = agreement.value;
  return createAgreement({...other, parentId: agreement.value?.parent?._id || null})
      .then(resp => {
        emit('create:success', resp.data || null);
        vuexStore.commit('alert/SUCCESS', 'Договор успешно создан');
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
  agreement.value = {
    ...agreement.value,
    number: null,
    date: null,
    description: null,
    parent: null,
  }
}
</script>