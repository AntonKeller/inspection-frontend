<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        :items="itemsForList"
        :loading="loading"
        @update:menu="handleUpdateMenu"
        prepend-inner-icon="mdi-account-hard-hat-outline"
        no-data-text="нет данных"
        color="yellow-darken-4"
        density="compact"
        variant="outlined"
        label="Инспектор"
        rounded="lg"
        hide-selected
        chips
        v-bind="$attrs"
    >
      <template #chip="{ props, item }">
        <v-chip
            v-bind="props"
            density="comfortable"
            :text="item.raw.display.chipTitle"
        />
      </template>

      <template #item="{ props, item }">
        <v-list-item
            v-bind="props"
            prepend-icon="mdi-file-document-edit"
            :title="item.raw.display.listTitle"
            :subtitle="item.raw.display.listSubtitle"
        >
          <template #append>
            <v-btn
                v-tooltip="'Удалить запись'"
                icon="mdi-progress-close"
                color="red-darken-4"
                density="comfortable"
                variant="text"
                @click.stop="handleRemoveItem(item.raw._id)"
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

    <v-overlay v-model="formIsOpen" class="d-flex justify-center align-center">
      <EmployerFormAdd @success="createSuccessHandler" @close="closeMenu"/>
    </v-overlay>
  </div>
</template>

<script setup>
import {useStore} from "vuex";
import useEmployeesApi from "@/composables/use-employees-api.js";


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


const CREATE_TOOLTIP = 'Добавить нового сотрудника';
const vuexStore = useStore();
const items = ref([]);
const formIsOpen = ref(false);
const loading = ref(false);
const search = ref('');
const {fetchAll: fetchAllEmployees, removeOne: removeOneEmployer} = useEmployeesApi();
const inspectorRules = [v => v || 'Выберите инспектора'];
const button = {
  class: "border-sm border-dashed",
  variant: "outlined",
  icon: "mdi-plus",
  rounded: "lg",
  size: "small",
  onClick: openMenu
}


const itemsForList = computed(() => {
  return itemsFiltered.value.map(buildItem);
});

const itemsFiltered = computed(() => {
  return filter(items.value, search.value);
});


function filter(items, search) {
  if (!search) return items.filter(props.filter);
  const regex = new RegExp(search, 'i');
  return items
      .filter(props.filter)
      .filter(e => {
        const join = [
          e.title || '',
        ].join(' ');
        return regex.test(join);
      });
}

function buildItem(e) {
  const fullName = `${e.raw?.firstName ?? ''} ${e.raw?.surname ?? ''} ${e.raw?.lastName ?? ''}`.trim();
  const contactsJoin = `${e.raw?.phoneNumber ?? ''} / ${e.raw?.email ?? ''}`.trim();
  return {
    ...e,
    display: {
      chipTitle: fullName,
      listTitle: fullName,
      listSubtitle: contactsJoin,
    }
  }
}

function handleUpdateMenu(status) {
  if (status) handleFetchItems();
}

function handleFetchItems() {
  loading.value = true;
  return fetchAllEmployees()
      .then(r => successHandler(r, null))
      .catch(e => errorHandler(e, 'Ошибка получения данных'))
      .finally(finallyHandler);
}

function handleRemoveItem(id) {
  loading.value = true;
  return removeOneEmployer(id)
      .then(r => successHandler(r, 'Документ успешно удален'))
      .catch(e => errorHandler(e, 'Ошибка удаления'))
      .finally(finallyHandler);
}

function createSuccessHandler() {
  formIsOpen.value = false;
  return handleFetchItems();
}

function openMenu() {
  formIsOpen.value = true;
}

function closeMenu() {
  formIsOpen.value = false;
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