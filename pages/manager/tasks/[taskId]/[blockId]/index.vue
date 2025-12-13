<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1280" class="bg-transparent">
      <v-card variant="text">

        <v-card-item>
          <div class="d-flex align-center text-body-1">
            <v-icon icon="mdi-map-marker-outline"/>
            <span class="ml-2">{{ block?.address ?? '[Адрес не указан]' }}</span>
          </div>
        </v-card-item>

        <v-card-item class="text-body-2 ml-1">
          <div class="d-flex ga-8">
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-weather-cloudy-clock"/>
              <div>
                <b>Начало:</b>
                <span class="ml-3 text-blue-accent-3">{{ dateFromTo }}</span>
              </div>
            </div>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-badge-account-outline"/>
              <div>
                <b>Инспектор:</b>
                <span class="ml-3 text-blue-accent-3">{{ inspector }}</span>
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
                  prepend-icon="mdi-tray-arrow-down"
                  color="deep-purple-accent-4"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="tonal"
                  size="small"
                  @click="downloadObjectsTemplate"
              >
                Скачать шаблон
                <v-tooltip activator="parent" location="top">
                  Скачать шаблон для заполнения объектами
                </v-tooltip>
              </v-btn>
              <v-btn
                  prepend-icon="mdi-tray-arrow-up"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="text"
                  size="small"
                  :disabled="!block?.template"
                  @click="$refs.excelFileInput.click()"
              >
                Загрузить объекты
                <v-tooltip activator="parent" location="top">
                  Загрузить объекты из excel
                </v-tooltip>
              </v-btn>
              <v-divider vertical/>
              <v-progress-circular
                  v-if="reportDownloadingProcess.percent > 0"
                  :model-value="reportDownloadingProcess.percent"
                  :size="18"
                  :width="2"
                  color="teal"
                  style="font-size: 10px"
              >
                {{ reportDownloadingProcess.percent }}
              </v-progress-circular>
              <v-btn
                  prepend-icon="mdi-file-document-arrow-right-outline"
                  append-icon="mdi-chevron-down"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="text"
                  size="small"
                  :disabled="!items || items.length === 0"
              >
                {{ reportDownloadingProcess.process ? 'Загрузка...' : 'Отчет' }}
                <v-menu :disabled="reportDownloadingProcess.process" activator="parent"
                        transition="slide-y-reverse-transition">
                  <v-sheet class="mt-1 rounded-lg border-sm elevation-0">
                    <v-list-item
                        title="Скачать отчет"
                        density="compact"
                        rounded
                        @click="downloadReport"
                    >
                      <template #append>
                        <v-icon icon="mdi-text-box-outline" size="x-small"/>
                      </template>
                    </v-list-item>
                    <v-list-item
                        title="Скачать фотоматериалы"
                        density="compact"
                        rounded
                        :disabled="downloadingPhotos"
                        :loading="downloadingPhotos"
                        @click="downloadPhotos"
                    >
                      <template #append>
                        <v-icon icon="mdi-image" size="x-small"/>
                      </template>
                    </v-list-item>
                  </v-sheet>
                </v-menu>
              </v-btn>
              <v-btn
                  v-if="selectedItems.length > 0"
                  append-icon="mdi-chevron-down"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="text"
                  size="small"
                  border="sm"
              >
                Операции
                <v-tooltip activator="parent" location="top">
                  Операции с выделенными объектами
                </v-tooltip>
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
                          <v-sheet class="pr-2 py-2">
                            <v-text-field v-model="searchTypes" v-bind="mySearchFieldStyle" @click.stop/>
                          </v-sheet>
                          <v-divider/>
                          <div v-if="objectTypesSearchFilter.length === 0" class="text-center py-2">Пусто</div>
                          <v-list-item
                              v-for="type of objectTypesSearchFilter"
                              :title="type"
                              class=" text-caption"
                              density="compact"
                              @click="onChangeTypeSelectedObjects(type)"
                          />
                        </v-sheet>
                      </v-menu>
                    </v-list-item>
                    <v-divider/>
                    <v-list-item
                        density="compact"
                        title="Удалить объекты"
                        @click="onRemoveSomeObjects"
                    />
                  </v-sheet>
                </v-menu>
              </v-btn>
              <v-spacer/>
              <v-btn
                  prepend-icon="mdi-text-box-outline"
                  append-icon="mdi-chevron-down"
                  :color="!block?.template ? 'orange-accent-4' : ''"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="text"
                  size="small"
                  :disabled="items && items.length > 0"
              >
                {{ block?.template?.title || '[Выберите шаблон]' }}
                <v-menu :open-on-focus="false" activator="parent" transition="slide-y-reverse-transition">
                  <v-sheet
                      max-height="250"
                      min-width="250"
                      class="border-sm rounded-lg bg-white mt-1"
                      transition="slide-y-reverse-transition"
                  >
                    <v-sheet class="pr-2 py-2">
                      <v-text-field v-model="searchTypes" v-bind="mySearchFieldStyle" @click.stop/>
                    </v-sheet>
                    <v-divider/>
                    <div v-if="templatesSearchFilter.length === 0" class="text-center py-2">Пусто</div>
                    <v-list-item
                        v-for="template of templatesSearchFilter"
                        :title="template?.title || ''"
                        class=" text-caption"
                        density="compact"
                        @click="onSetTemplate(template)"
                    />
                  </v-sheet>
                </v-menu>
              </v-btn>
              <v-divider vertical/>
              <v-btn
                  prepend-icon="mdi-table-large-remove"
                  color="red-darken-4"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="text"
                  size="small"
                  :disabled="!items || items.length === 0"
                  @click="removeAllQuestionVisible = true"
              >
                Удалить все
                <v-tooltip activator="parent" location="top">
                  Удалить все объекты
                </v-tooltip>
              </v-btn>
            </v-sheet>

            <v-sheet v-bind="myTableSheetStyle">
              <v-sheet class="d-flex align-center mb-6">
                <b>Объекты осмотра</b>
                <v-spacer/>
                <v-text-field v-model="searchText" v-bind="mySearchFieldStyle"/>
              </v-sheet>
              <v-data-table
                  v-model="selectedItems"
                  v-model:items-per-page="itemsPerPage"
                  :items-per-page-options="itemsPerPageOptions"
                  :items-per-page="itemsPerPage"
                  :search="searchText"
                  :loading="fetching"
                  :headers="tableHeaders"
                  :items="itemsMap"
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
                  @update:current-items="selectedItems = []"
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
                          v-if="updatingIds.includes(item._id)"
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
                        <v-sheet class="pr-2 py-2">
                          <v-text-field v-model="searchTypes" v-bind="mySearchFieldStyle" @click.stop/>
                        </v-sheet>
                        <v-divider/>
                        <div v-if="objectTypesSearchFilter.length === 0" class="text-center py-2">Пусто</div>
                        <v-list-item
                            v-for="type of objectTypesSearchFilter"
                            :title="type"
                            class=" text-caption"
                            density="compact"
                            @click="onChangeObjectType(item._id, type)"
                        />
                      </v-sheet>
                    </v-menu>
                  </v-chip>
                </template>
                <template #item.actions="{ item }">
                  <v-btn
                      icon="mdi-open-in-new"
                      density="comfortable"
                      variant="text"
                      size="small"
                      rounded
                      @click.stop="onOpenObjectCard(item._id)"
                  >
                    <v-icon/>
                    <v-tooltip activator="parent" location="left">
                      Открыть карточку
                    </v-tooltip>
                  </v-btn>
<!--                  <my-change-button-->
<!--                      class="ml-2"-->
<!--                      prompt="Редактировать объект"-->
<!--                      @click.stop="onObjectChange(item._id)"-->
<!--                  />-->
                </template>
              </v-data-table>
            </v-sheet>
          </v-sheet>
        </v-card-item>
      </v-card>

      <my-overlay v-model="removeAllQuestionVisible">
        <v-sheet class="px-4 py-1 bg-white rounded-lg">
          <v-card-item>
            Очистить таблицу ?
          </v-card-item>
          <v-card-subtitle>
            удалить все объекты и фотографии
          </v-card-subtitle>
          <v-card-item>
            <v-divider/>
          </v-card-item>
          <v-card-actions>
            <v-btn
                @click.stop="removeObjectsAll"
                class="border-sm rounded-lg"
                density="comfortable"
                variant="flat"
                text="Да"
            />
            <v-btn
                @click.stop="removeAllQuestionVisible=false"
                density="comfortable"
                class="rounded-lg"
                text="Отмена"
            />
          </v-card-actions>
        </v-sheet>
      </my-overlay>
    </v-sheet>

    <v-file-input class="d-none" ref="excelFileInput" accept=".xlsx" @change="onExcelFileInput"/>
  </v-container>
</template>

<script>
import {
  fetchInspectionObjects,
  changeInspectionObject,
  changeSomeObjects,
  removeObjects,
  uploadObjects, removeSomeObjects,
} from "../../../../../utils/api/api_inspection_objects";
import {
  navigateBackBtnStyle,
  mySearchFieldStyle,
  myTableSheetStyle,
  myBtnPlus,
} from "../../../../../configs/styles";
import {
  fetchAssignmentAddress,
  downloadPhotos,
  changeAssignmentBlock
} from "../../../../../utils/api/api_assignment_blocks";
import {unixDateToMiddleDateString} from "../../../../../utils/functions";
import {serverURL} from "../../../../../constants/constants";
import {downloadFile} from "../../../../../utils/api/api_";
import {fetchTemplates} from "@/utils/api/templates";
import {tableHeaders} from "@/configs/objects";
import {navigateTo} from "nuxt/app";

export default {
  name: "block-page",

  data() {
    return {
      tableHeaders,
      items: [],
      selectedItems: [],
      fetching: false,
      block: null,
      searchText: '',
      searchTypes: '',
      itemsPerPage: 10,
      itemsPerPageOptions: [
        {value: 10, title: '10'},
        {value: 25, title: '25'},
        {value: 50, title: '50'},
      ],

      reportDownloadingProcess: {
        process: false,
        percent: 0,
      },

      updatingIds: [],
      reportDownloading: false,
      downloadingPhotos: false,
      removeAllQuestionVisible: false,

      templates: [],

      // IMPORT STYLES
      navigateBackBtnStyle,
      mySearchFieldStyle,
      myTableSheetStyle,
      myBtnPlus,
    }
  },

  beforeMount() {

    fetchAssignmentAddress(useRoute().params.blockId)
        .then(response => {
          this.block = response.data ?? null;
          this.fetchInspectionObjects();
        })
        .catch(err => {
          console.log('Ошибка, такого адреса не существует', err);
          this.$store.commit('alert/ERROR', 'Такого адреса не существует');
          this.navigateBack();
        });

    fetchTemplates()
        .then(response => {
          this.templates = response.data || [];
        })
        .catch(err => {
          console.log('Ошибка загрузки шаблонов', err);
          this.$store.commit('alert/ERROR', 'Ошибка загрузки шаблонов');
        })
  },

  computed: {

    itemsMap() {
      return this.itemsSearchFilter.map((e, i) => ({
        _id: e._id,
        number: i + 1,
        name: e?.name, //  ? this.textSlicer(e?.name, 100) : '-',
        inventoryNumber: e?.inventoryNumber ? this.textSlicer(e?.inventoryNumber, 25) : '-',
        isExist: e.isExist === null ? '-' : e.isExist === true ? 'Да' : 'Нет',
        isDefect: e.isDefect === null ? '-' : e.isDefect === true ? 'Да' : 'Нет',
        objectType: e.objectType ?? 'не задан',
        defectDescription: e.description ? this.textSlicer(e.description, 20) : '-',
      }))
    },

    itemsSearchFilter() {
      if (typeof this.searchText === 'string' && this.searchText.length > 0) {
        const exp = new RegExp(this.searchText, "ig")
        return this.items.filter(object => {
          return [
            object?.address,
            object?.description,
            object?.objectType,
            object?.name,
            object?.model,
            object?.serialNumber,
            object?.status,
            object?.inventoryNumber
          ].filter(e => !!e).find(value => exp.test(value));
        })
      } else {
        return this.items;
      }
    },

    templatesSearchFilter() {
      return this.templates;
    },

    objectTypesSearchFilter() {
      const ex = new RegExp(this.searchTypes, 'ig')
      return this.objectTypes?.filter(e => ex.test(e)) || [];
    },

    objectTypes() {
      if (!this.block?.template) {
        return this.templates
            ?.find(e => e.isBase)?.objectTypes
            ?.map(e => e.type) || []
      }
      return this.block?.template?.objectTypes.map(e => e.type);
    },


    dateFromTo() {
      return unixDateToMiddleDateString(this.block?.startDate);
    },

    inspector() {
      if (!this.block?.inspector?.firstName
          && !this.block?.inspector?.lastName
          && !this.block?.inspector?.phoneNumber
      ) return '[Не указан]'

      return this.block?.inspector?.firstName +
          (this.block?.inspector?.lastName ? ` ${this.block?.inspector?.lastName}` : '') +
          (this.block?.inspector?.phoneNumber ? `, ${this.block?.inspector?.phoneNumber}` : '')
    }

  },

  methods: {

    onSetTemplate(template) {
      this.block.template = template;
      changeAssignmentBlock(this.block)
          .then(resp => {
            this.$store.commit('alert/SUCCESS', 'Шаблон изменен');
            console.log(this.block.template)
          })
          .catch(err => {
            this.$store.commit('alert/ERROR', 'Не удалось изменить шаблон');
            this.block.template = null;
          })

    },

    async downloadPhotos() {
      this.downloadingPhotos = true;
      await downloadPhotos(this.block._id, this.reportDownloadingProcess);
      this.downloadingPhotos = false;
    },

    getColorByStatus(inspectionObject) {
      if (!inspectionObject.isExist) return 'bg-pink-lighten-5';
      if (inspectionObject.isDefect) return 'bg-amber-lighten-4';
      return '';
    },

    onChangeObjectType(id, newType) {

      this.searchTypes = '';

      const searchItem = this.items.find(e => e._id === id);

      if (!searchItem) {
        this.$store.commit('alert/ERROR', 'Ошибка редактирования. Не найден элемент');
        return;
      }

      this.updatingIds.push(id);

      changeInspectionObject({
        ...searchItem,
        objectType: newType,
      }).then(() => {
        searchItem.objectType = newType;
      }).catch(err => {
        console.log('Ошибка редактирования', err);
        this.$store.commit('alert/ERROR', 'Не удалось отредактировать');
      }).finally(() => {
        this.updatingIds = this.updatingIds.filter(_id => _id !== id);
      });
    },

    onChangeTypeSelectedObjects(type) {
      if (!this.selectedItems || this.selectedItems.length === 0) return;

      const itemsForChange = [];

      this.selectedItems.forEach(id => {
        itemsForChange.push({
          ...this.items.find(e => e._id === id),
          objectType: type,
        })
      })

      changeSomeObjects(itemsForChange)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Записи изменены');
            this.fetchInspectionObjects();
          })
          .catch(err => {
            console.log('Не удалось изменить записи', err);
            this.$store.commit('alert/ERROR', 'Не удалось изменить записи');
          })
    },

    downloadObjectsTemplate() {
      downloadFile('objects template.xlsx', serverURL + '/inspection-objects/inspectionObjectTemplates');
    },

    downloadReport() {
      this.reportDownloading = true;

      const url = `${serverURL}/reports/${useRoute().params.blockId}/commercial-proposal`;

      downloadFile('Отчет.docx', url, this.reportDownloadingProcess)
          .catch(err => {
            console.log('Ошибка загрузки отчета', err);
          })
          .finally(() => {
            this.reportDownloading = false;
          })
    },

    onExcelFileInput(event) {
      if (event.target.files && event.target.files.length > 0) {
        uploadObjects(this.block._id, event.target.files[0])
            .then(() => {
              this.$refs.excelFileInput.value = '';
              this.fetchInspectionObjects();
            })
            .catch(err => {
              this.$store.commit('alert/ERROR', 'Не удалось загрузить файл');
              console.log('Не удалось загрузить файл', err);
            })
      }
    },

    fetchInspectionObjects() {
      fetchInspectionObjects(useRoute().params.blockId)
          .then(response => {
            this.items = response.data ?? [];
          })
          .catch(err => {
            console.log('Ошибка получения списка объектов', err)
          })
    },

    navigateBack() {
      navigateTo(`/manager/assignments/${useRoute().params.assignmentId}/`);
    },

    textSlicer(txt, size) {
      return txt?.length > size ? txt.slice(0, size - 3) + '...' : txt;
    },

    onOpenObjectCard(id) {
      navigateTo(`${id}/`);
    },

    onObjectChange(id) {
      navigateTo(`${id}/change`);
    },

    onRemoveSomeObjects() {
      if (Array.isArray(this.selectedItems) && this.selectedItems.length > 0) {
        removeSomeObjects(this.selectedItems)
            .then(() => {
              this.$store.commit('alert/SUCCESS', 'Объекты успешно удалены');
              this.selectedItems = [];
              this.fetchInspectionObjects();
            })
            .catch(err => {
              this.$store.commit('alert/ERROR', 'Не удалось удалить объекты');
              console.log('Ошибка удаления объектов', err);
            });
      }
    },

    removeObjectsAll() {
      removeObjects(this.block._id)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Объекты успешно удалены');
            this.selectedItems = [];
            this.fetchInspectionObjects();
          })
          .catch(err => {
            this.$store.commit('alert/ERROR', 'Не удалось удалить объекты');
            console.log('Ошибка удаления объектов', err);
          })
          .finally(() => {
            this.removeAllQuestionVisible = false;
          })
    },
  }
}
</script>

<style>
.small-font td {
  font-size: 12px; /* Уменьшение шрифта */
}
</style>
