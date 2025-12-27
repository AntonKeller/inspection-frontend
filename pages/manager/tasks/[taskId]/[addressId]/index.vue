<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1280" class="bg-transparent">
      <v-card variant="text">

        <v-card-item>
          <div class="d-flex align-center text-body-1">
            <v-icon icon="mdi-map-marker-outline"/>
            <span class="ml-2">{{ address?.address || '[Адрес не указан]' }}</span>
          </div>
        </v-card-item>

        <v-card-item class="text-body-2 ml-1">
          <div class="d-flex ga-8">
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-weather-cloudy-clock"/>
              <div>
                <b>Начало:</b>
                <span class="ml-3 text-blue-accent-3">{{ addressStartDate }}</span>
              </div>
            </div>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-badge-account-outline"/>
              <div>
                <b>Инспектор:</b>
                <span class="ml-3 text-blue-accent-3">{{ employer }}</span>
              </div>
            </div>
          </div>
        </v-card-item>

        <v-card-item>
          <v-btn v-bind="navigateBackBtnStyle" @click="navigateBack">
            Назад
            <v-tooltip activator="parent" location="left">
              Вернуться назад
            </v-tooltip>
          </v-btn>
        </v-card-item>

        <v-card-item/>

        <v-card-item>
          <v-sheet class="d-flex flex-column ga-4 bg-transparent">
            <v-sheet class="d-flex align-center ga-1 py-2 px-2 bg-lighten-5" border="sm" rounded="lg">
              <v-btn
                  v-tooltip="'Скачать шаблон для заполнения объектами'"
                  prepend-icon="mdi-tray-arrow-down"
                  color="deep-purple-accent-4"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="tonal"
                  size="small"
                  title="Скачать шаблон"
                  @click="handleDownloadObjects"
              />
              <v-btn
                  prepend-icon="mdi-tray-arrow-up"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="text"
                  size="small"
                  :disabled="!address?.template"
                  @click="$refs.excelFileInput.click()"
              >
                Загрузить объекты
                <v-tooltip activator="parent" location="top">
                  Загрузить объекты из excel
                </v-tooltip>
              </v-btn>
              <v-divider vertical/>
              <v-btn
                  prepend-icon="mdi-file-document-arrow-right-outline"
                  append-icon="mdi-chevron-down"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="text"
                  size="small"
                  :disabled="!addressObjects || addressObjects.length === 0"
              >
                {{ reportLoading ? 'Загрузка...' : 'Отчет' }}
                <v-menu
                    :disabled="reportLoading"
                    transition="slide-y-reverse-transition"
                    activator="parent"
                >
                  <v-sheet class="mt-1 rounded-lg border-sm elevation-0">
                    <v-list-item
                        title="Скачать отчет"
                        density="compact"
                        rounded
                        @click="handleDownloadReport"
                    >
                      <template #append>
                        <v-icon icon="mdi-text-box-outline" size="x-small"/>
                      </template>
                    </v-list-item>
                    <v-list-item
                        title="Скачать фотоматериалы"
                        density="compact"
                        rounded
                        :disabled="photosLoading"
                        :loading="photosLoading"
                        @click="handleDownloadPhotos"
                    >
                      <template #append>
                        <v-icon icon="mdi-image" size="x-small"/>
                      </template>
                    </v-list-item>
                  </v-sheet>
                </v-menu>
              </v-btn>
              <v-btn
                  v-if="selected.length > 0"
                  v-tooltip="'Операции с выделенными объектами'"
                  append-icon="mdi-chevron-down"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="text"
                  size="small"
                  border="sm"
              >
                Операции
                <v-menu activator="parent" transition="slide-y-reverse-transition">
                  <v-sheet class="mt-1 rounded-lg elevation-0 border-sm">
                    <v-list-item
                        append-icon="mdi-menu-right"
                        title="Изменить тип объектов"
                        density="compact"
                    >
                      <v-menu :open-on-focus="false" activator="parent" open-on-hover submenu>
                        <v-sheet
                            max-height="250"
                            min-width="250"
                            class="border-sm rounded-lg bg-white mr-1"
                            transition="slide-y-reverse-transition"
                        >
                          <v-sheet class="pa-2">
                            <v-text-field
                                v-model="objectTypesSearch"
                                v-bind="mySearchFieldStyle"
                                @click.stop
                            />
                          </v-sheet>
                          <v-divider/>
                          <div v-if="objectTypesSearchFiltered.length === 0" class="text-center py-2">Пусто</div>
                          <v-list-item
                              v-for="type of objectTypesSearchFiltered"
                              :title="type"
                              class=" text-caption"
                              density="compact"
                              @click="updateManyObjectsField(selected, 'type', type)"
                          />
                        </v-sheet>
                      </v-menu>
                    </v-list-item>
                    <v-divider/>
                    <v-list-item
                        density="compact"
                        title="Удалить объекты"
                    />
                  </v-sheet>
                </v-menu>
              </v-btn>
              <v-spacer/>
              <v-btn
                  prepend-icon="mdi-text-box-outline"
                  append-icon="mdi-chevron-down"
                  :color="!address?.template ? 'orange-accent-4' : ''"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="text"
                  size="small"
                  :disabled="addressObjects && addressObjects.length > 0"
              >
                {{ address?.template?.title || '[Выберите шаблон]' }}
                <v-menu :open-on-focus="false" activator="parent" transition="slide-y-reverse-transition">
                  <v-sheet
                      max-height="250"
                      min-width="250"
                      class="border-sm rounded-lg bg-white mt-1"
                      transition="slide-y-reverse-transition"
                  >
                    <v-sheet class="pa-2">
                      <v-text-field
                          v-model="objectTypesSearchFiltered"
                          v-bind="mySearchFieldStyle"
                          @click.stop
                      />
                    </v-sheet>
                    <v-divider/>
                    <div v-if="templates.length === 0" class="text-center py-2">Пусто</div>
                    <v-list-item
                        v-for="template of templates"
                        :title="template?.title || ''"
                        class=" text-caption"
                        density="compact"
                        @click="handleSetTemplateToAddress(template)"
                    />
                  </v-sheet>
                </v-menu>
              </v-btn>
              <v-divider vertical/>
              <v-btn
                  v-tooltip="'Удалить все объекты'"
                  prepend-icon="mdi-table-large-remove"
                  color="red-darken-4"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="text"
                  size="small"
                  title="Удалить все"
                  :disabled="!addressObjects || addressObjects.length === 0"
              />
            </v-sheet>

            <v-sheet v-bind="myTableSheetStyle">
              <v-sheet class="d-flex align-center mb-6">
                <b>Объекты осмотра</b>
                <v-spacer/>
                <v-text-field v-model="searchQuery" v-bind="mySearchFieldStyle"/>
              </v-sheet>
              <v-data-table
                  v-model="selected"
                  v-model:items-per-page="itemsPerPage"
                  :items-per-page-options="itemsPerPageOptions"
                  :items-per-page="itemsPerPage"
                  :loading="loading"
                  :headers="addressObjectsTableHeaders"
                  :items="addressObjectsSearchFiltered"
                  style="max-height: 500px"
                  items-per-page-text="Кол-во на странице"
                  loading-text="Загрузка данных..."
                  no-data-text="Нет данных"
                  class="bg-transparent"
                  density="comfortable"
                  items-per-page="5"
                  item-value="_id"
                  fixed-header
                  show-select
                  @update:current-items="selected = []"
              >
                <template #item.objectType="{ item }">
                  <v-chip
                      append-icon="mdi-menu-down"
                      class="cursor-pointer"
                      density="compact"
                      border="thin"
                      size="small"
                      color="indigo"
                      label
                  >
                    {{ item.objectType }}
                    <template #prepend>
                      <v-progress-circular
                          v-if="objectTypesIdsUpdating.includes(item._id)"
                          color="indigo-accent-4"
                          indeterminate
                          width="1"
                          size="8"
                          class="mr-1"
                      />
                    </template>
                    <v-tooltip>Выбрать тип</v-tooltip>
                    <v-menu activator="parent" location="left top">
                      <v-sheet
                          max-height="250"
                          min-width="250"
                          class="border-sm rounded-lg bg-white mr-1"
                          transition="slide-y-reverse-transition"
                          elevation="0"
                      >
                        <v-sheet class="pa-2">
                          <v-text-field
                              v-model="objectTypesSearch"
                              v-bind="mySearchFieldStyle"
                              @click.stop
                          />
                        </v-sheet>
                        <v-divider/>
                        <div v-if="objectTypesSearchFiltered.length === 0" class="text-center py-2">Пусто</div>
                        <v-list-item
                            v-for="type of objectTypesSearchFiltered"
                            :title="type"
                            class=" text-caption"
                            density="compact"
                            @click="updateObjectField(item._id, 'type', type)"
                        />
                      </v-sheet>
                    </v-menu>
                  </v-chip>
                </template>
                <template #item.actions="{ item }">
                  <v-btn
                      v-tooltip="'Открыть карточку объекта'"
                      density="comfortable"
                      variant="text"
                      size="small"
                      icon=""
                      rounded
                      @click.stop="navigateTo(`${item._id}/`)"
                  >
                    <v-icon icon="mdi-open-in-new"/>
                  </v-btn>
                </template>
              </v-data-table>
            </v-sheet>
          </v-sheet>
        </v-card-item>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script setup>
import addressObjectsTableHeaders from "../../../../../constants/address-objects-table-headers";
import {
  navigateBackBtnStyle,
  mySearchFieldStyle,
  myTableSheetStyle,
} from "../../../../../configs/styles";
import {itemsPerPage, itemsPerPageOptions} from "@/constants/table-options";
import {useStore} from "vuex";
import useTargetObjectsApi from "../../../../../composables/use-target-objects-api";
import useTargetAddressesApi from "../../../../../composables/use-target-addresses-api";
import useTemplatesApi from "../../../../../composables/use-templates-api";
import escapeRegExp from "lodash/escapeRegExp";
import {navigateTo} from "nuxt/app";


const vuexStore = useStore();
const address = ref({});
const addressObjects = ref([]);
const selected = ref([]);
const loading = ref(false);
const templates = ref([]);
const searchQuery = ref('');
const objectTypes = ref([]);
const objectTypesSearch = ref('');
const objectTypesLoading = ref(false);
const objectTypesIdsUpdating = ref(false);
const templatesLoading = ref(false);
const photosLoading = ref(false);
const reportLoading = ref(false);
const {
  fetchAllByTargetAddress: fetchAllTargetObjectsByAddress
} = useTargetObjectsApi();
const {} = useTargetAddressesApi();
const {
  fetchAll: fetchAllTemplates
} = useTemplatesApi();


onMounted(async () => {
  await updateObjectsTable(useRoute().params.addressId);
  await updateTemplatesMenu();
});


const addressObjectsSearchFiltered = computed(() => {
  if (!searchQuery.value) return addressObjects.value;
  const searchRegex = new RegExp(escapeRegExp(searchQuery.value), 'i');
  return addressObjects.value.filter(e => {
    return searchRegex.test([
      e.name || '',
      e.identifier || '',
      e.address || '',
      e.type || ''
    ].join(' '));
  });
});

const objectTypesSearchFiltered = computed(() => {
  if (!objectTypesSearch.value) return objectTypes.value;
  const searchRegex = new RegExp(escapeRegExp(objectTypesSearch.value), 'i');
  return objectTypes.value.filter(searchRegex.test);
});

const addressStartDate = computed(() => {
  return unixDateToMiddleDateString(address.value.startDate);
});

const employer = computed(() => {
  const employer = address.value.employer;
  if (!employer || (!employer.firstName && !employer.surname && !employer.lastName)) return;
  return `${employer.firstName} ${employer.surname} ${employer.lastName}`.replace(/\s+/g, ' ').trim();
});


function updateObjectsTable(addressId) {
  if (!addressId) return;
  loading.value = true;
  return fetchAllTargetObjectsByAddress(addressId)
      .then((resp) => {
        addressObjects.value = resp.data || [];
        return resp;
      })
      .catch(async (e) => {
        console.log('Ошибка получения списка объектов', e);
        vuexStore.commit('alert/ERROR', 'Ошибка получения объектов');
        await navigateBack();
      })
      .finally(() => {
        loading.value = false;
        selected.value = [];
      });
}

function updateTemplatesMenu() {
  templatesLoading.value = true;
  return fetchAllTemplates()
      .then(resp => {
        templates.value = resp.data || [];
        return resp;
      })
      .catch(e => {
        console.log('Ошибка получения списка объектов', e);
        vuexStore.commit('alert/ERROR', 'Ошибка получения шаблонов');
      })
      .finally(() => {
        templatesLoading.value = false;
      });
}

function handleSetTemplateToAddress(template) {
  //  TODO: Добавить логику обновления Address, установив ему новый template
}

function handleDownloadPhotos() {
  //  TODO: Добавить логику скачивания архива всех фотографий отсортированных по папкам
}

function colorOfObjectStatus() {
  //  TODO: Добавить логику определения цвета по статусу объекта
  // getColorByStatus(inspectionObject) {
  //   if (!inspectionObject.isExist) return 'bg-pink-lighten-5';
  //   if (inspectionObject.isDefect) return 'bg-amber-lighten-4';
  //   return '';
  // },
}

function updateObjectField(id, field, val) {
  //  TODO: Добавить логику обновления значения поля у объекта (например тип объекта от шаблона)
}

function updateManyObjectsField(ids, field, val) {
  //  TODO: Добавить логику обновления значения поля у нескольких объектов (например тип объекта от шаблона)
}

function handleDownloadObjects() {
  //  TODO: Добавить логику скачивания шаблона для заполнения объектами и последующей загрузки
}

function handleUploadObjects() {
  //  TODO: Добавить логику скачивания шаблона для заполнения объектами и последующей загрузки
}

function handleDownloadReport() {
  //  TODO: Добавить логику скачивания финального отчета
}

function navigateBack() {
  return navigateTo(`/manager/tasks/${useRoute().params.taskId}/`);
}

function handleRemoveObject(id) {
  //  TODO: Добавить логику удаления объекта
}

function handleRemoveManyObjects() {
  //  TODO: Добавить логику удаления списка объектов
}
</script>

<style>
.small-font td {
  font-size: 12px; /* Уменьшение шрифта */
}
</style>
