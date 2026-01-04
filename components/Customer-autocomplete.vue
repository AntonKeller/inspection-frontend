<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        :items="itemsFiltered"
        :loading="loading"
        @update:menu="updateMenu"
        prepend-inner-icon="mdi-account-tie"
        no-data-text="нет данных"
        color="yellow-darken-4"
        variant="outlined"
        density="compact"
        label="Заказчик"
        rounded="lg"
        hide-selected
        chips
        v-bind="$attrs"

    >
      <template #chip="{ props, item }">
        <v-chip
            v-bind="props"
            :text="title(item.raw)"
            density="comfortable"
            variant="tonal"
        />
      </template>

      <template #item="{ props, item }">
        <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-tie"
            slim
            nav
            :title="title(item.raw)"
            :subtitle="subTitle(item.raw)"
        >
          <span class="text-caption text-blue-darken-1">{{ customerContactsTitle(item.raw) }}</span>
          <template #append>
            <v-btn
                icon="mdi-progress-close"
                color="red-darken-4"
                density="comfortable"
                variant="text"
                @click.stop="handleRemoveItem(item.raw._id)"
            >
              <v-icon/>
              <v-tooltip activator="parent">
                Удалить запись
              </v-tooltip>
            </v-btn>
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>

    <v-btn
        v-if="showBtn"
        class="border-sm border-dashed"
        variant="outlined"
        icon="mdi-plus"
        rounded="lg"
        size="small"
        @click="formIsOpen = true"
    >
      <v-icon/>
      <v-tooltip activator="parent" location="left">
        Добавить нового заказчика
      </v-tooltip>
    </v-btn>

    <v-overlay v-model="formIsOpen" class="d-flex justify-center align-center">
      <CustomerFormAdd @create:success="onCreateSuccess" @click:close="formIsOpen = false"/>
    </v-overlay>
  </div>
</template>

<script setup>
import {useStore} from "vuex";
import useCustomersApi from "@/composables/use-customers-api";


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
const items = ref([]);
const loading = ref(false);
const formIsOpen = ref(false);
const loadingItem = ref({});
const search = ref('');
const {fetchAll: fetchAllItems, removeOne: removeOneItem} = useCustomersApi();


function title(item) {
  return item.fullName || '[наименование не указано]';
}

function subTitle(item) {
  return 'Юридический адрес: ' + (item.legalAddress || '[не указан]');
}

function customerContactsTitle(item) {
  return item.email + ' | ' + item.phoneNumber;
}

const itemsFiltered = computed(() => {
  if (!search.value) return items.value;
  const searchRegex = new RegExp(search.value, 'i');
  return items.value
      .filter(props.filter)
      .filter(val => searchRegex.test(val));
});


function updateMenu(val) {
  if (val) {
    handleFetchItems();
  }
}

function handleFetchItems() {
  loading.value = true;
  return fetchAllItems()
      .then(resp => {
        items.value = resp.data || [];
        return resp;
      })
      .catch(e => {
        console.log('Ошибка получения данных', e)
      })
      .finally(() => {
        loading.value = false;
      });
}

function handleRemoveItem(id) {
  loadingItem.value[id] = true;
  return removeOneItem(id)
      .then((resp) => {
        handleFetchItems();
        return resp;
      })
      .catch(e => {
        console.log('Ошибка удаления', e);
        vuexStore.commit('alert/ERROR', 'Ошибка удаления');
      })
      .finally(() => {
        loadingItem.value[id] = false;
      });
}

function onCreateSuccess() {
  handleFetchItems();
  formIsOpen.value = false;
}
</script>