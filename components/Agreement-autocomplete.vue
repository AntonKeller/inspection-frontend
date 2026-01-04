<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        :items="agreementsFiltered"
        :loading="loading"
        @update:menu="updateMenu"
        prepend-inner-icon="mdi-file-document-edit"
        no-data-text="нет данных"
        color="yellow-darken-4"
        variant="outlined"
        density="compact"
        label="Договор с заказчиком"
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
            prepend-icon="mdi-file-document-edit"
            slim
            nav
            :title="title(item.raw)"
            :subtitle="subTitle(item.raw)"
        >
          <template #append>
            <v-btn
                icon="mdi-progress-close"
                color="red-darken-4"
                density="comfortable"
                variant="text"
                @click.stop="handleRemoveAgreement(item.raw._id)"
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
        Добавить новый договор с заказчиком
      </v-tooltip>
    </v-btn>

    <v-overlay v-model="formIsOpen" class="d-flex justify-center align-center">
      <AgreementFormAdd @create:success="onCreateSuccess" @click:close="formIsOpen = false"/>
    </v-overlay>
  </div>
</template>

<script setup>
import useAgreementsApi from "@/composables/use-agreements-api";
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
const agreements = ref([]);
const loading = ref(false);
const formIsOpen = ref(false);
const loadingItem = ref({});
const search = ref('');
const {
  fetchAll: fetchAllAgreements,
  removeOne: removeOneAgreement,
} = useAgreementsApi();


function title(item) {
  if (item.isParent) {
    return 'Договор № ' + (item.number || '[не указан]') + ' от ' + (item.date ? toLocaleDate(item.date) : '[дата не указана]')
  } else {
    return 'Задание № ' + (item.number || '[не указан]') + ' от ' + (item.date ? toLocaleDate(item.date) : '[дата не указана]')
  }
}

function toLocaleDate(val) {
  return new Date(val).toLocaleDateString();
}

function subTitle(item) {
  if (item.isParent) return '';
  return 'К договору № ' + (item?.parent?.number || '[не указан]');
}


const agreementsFiltered = computed(() => {
  if (!search.value) return agreements.value.filter(props.filter);
  const searchRegex = new RegExp(search.value, 'i');
  return agreements.value.filter(val => props.filter(val) && searchRegex.test(val));
});


function updateMenu(val) {
  if (val) {
    handleFetchAgreements();
  }
}

function handleFetchAgreements() {
  loading.value = true;
  return fetchAllAgreements()
      .then(resp => {
        agreements.value = resp.data || [];
        return resp;
      })
      .catch(e => {
        console.log('Ошибка получения данных о договорах', e)
      })
      .finally(() => {
        loading.value = false;
      });
}

function handleRemoveAgreement(id) {
  loadingItem.value[id] = true;
  return removeOneAgreement(id)
      .then((resp) => {
        handleFetchAgreements();
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
  handleFetchAgreements();
  formIsOpen.value = false;
}
</script>