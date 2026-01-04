<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        :loading="loading"
        :items="itemsFiltered"
        @update:menu="updateMenuHandler"
        prepend-inner-icon="mdi-file-sign"

        no-data-text="нет данных"
        color="yellow-darken-4"
        density="compact"
        variant="outlined"
        label="Список кредитных договоров"
        multiple
        rounded="lg"
        hide-selected
        chips
        v-bind="$attrs"
    >
      <template #chip="{ props, item }">
        <v-chip
            v-bind="props"
            density="comfortable"
            :text="`${item.raw?.number} / ${unixDateToLongDateString(item.raw?.date)}`"
        />
      </template>

      <template #item="{ props, item }">
        <v-list-item
            v-bind="props"
            prepend-icon="mdi-file-document-edit"
            :title="item.raw?.number"
            :subtitle="unixDateToLongDateString(item.raw?.date)"
        >
          <template #append>
            <v-btn
                v-tooltip="'Удалить запись'"
                density="comfortable"
                color="red-darken-2"
                icon="mdi-close"
                variant="text"
                size="small"
                @click.stop="removeItem(item.raw._id)"
            >
              <v-icon/>
            </v-btn>
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>

    <v-btn v-if="showBtn" v-bind="button" v-tooltip="CREATE_TOOLTIP">
      <v-icon/>
    </v-btn>

    <v-overlay v-model="menuIsOpen" class="d-flex justify-center align-center">
      <LoanAgreementFormAdd @success="createSuccessHandler" @close="closeMenu"/>
    </v-overlay>
  </div>
</template>

<script setup>
import {unixDateToLongDateString} from "../utils/functions.js";
import escapeRegExp from "lodash/escapeRegExp";
import useLoanAgreementsApi from "@/composables/use-loan-agreements-api.ts";
import {useStore} from "vuex";


defineOptions({
  inheritAttrs: false
});


const props = defineProps({
  filter: {
    type: Function,
    default: () => true
  },
  showBtn: {
    type: Boolean,
    default: false
  }
});


const vuexStore = useStore();
const CREATE_TOOLTIP = 'Добавить новый кредитный договор';
const items = ref([]);
const loading = ref(false);
const menuIsOpen = ref(false);
const search = ref('');
const button = {
  class: "border-sm border-dashed",
  variant: "outlined",
  icon: "mdi-plus",
  rounded: "lg",
  size: "small",
  onClick: openMenu
}
const {
  removeOne: removeOneItem,
  fetchAll: fetchAllItems,
} = useLoanAgreementsApi();


const itemsFiltered = computed(() => itemsFilter(items.value, search.value));


function itemsFilter(items) {
  if (!search.value) return items;
  const regex = new RegExp(escapeRegExp(search.value), 'i');
  return items.filter((e) => {
    const join = [
      e.number || ''
    ].join(' ');
    return regex.test(join);
  });
}

function openMenu() {
  menuIsOpen.value = true;
}

function closeMenu() {
  menuIsOpen.value = false;
}

function createSuccessHandler() {
  menuIsOpen.value = false;
  return updateItems();
}

function updateMenuHandler(status) {
  if (status) updateItems();
}

function updateItems() {
  loading.value = true;
  return fetchAllItems()
      .then((r) => successHandler(r, null, () => items.value = r.data || []))
      .catch((e) => errorHandler(e, 'Ошибка загрузки данных'))
      .finally(finallyHandler)
}

function removeItem(id) {
  loading.value = true;
  return removeOneItem(id)
      .then((r) => successHandler(r, 'Документ успешно удален', updateItems))
      .catch((e) => errorHandler(e, 'Ошибка удаления документа'))
      .finally(finallyHandler)
}


function successHandler(r, msg, call) {
  if (msg) vuexStore.commit('alert/SUCCESS', msg);
  if (call) call();
  return r;
}

function errorHandler(e, msg, call) {
  console.log('Ошибка удаления', e);
  vuexStore.commit('alert/ERROR', msg || e.response?.data?.message || 'Неизвестная ошибка');
  if (call) call();
}

function finallyHandler() {
  loading.value = false;
}
</script>