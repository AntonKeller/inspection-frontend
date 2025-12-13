<template>
  <v-container fluid class="bg-white">
    <v-sheet max-width="1080" class="bg-transparent">

      <v-sheet class="border-b bg-white pb-3">
        <div>
          <v-card-title>{{ assignment?.title }}</v-card-title>
          <v-card-subtitle class="d-flex align-center ga-2">
            <v-icon icon="mdi-checkbox-marked-circle-auto-outline" size="small"/>
            Текущее задание
          </v-card-subtitle>
        </div>

        <v-card-item>
          <v-btn v-bind="navigateBackBtnStyle" @click="navigateBack">
            Назад
            <v-tooltip activator="parent" location="right">
              Вернуться назад
            </v-tooltip>
          </v-btn>
        </v-card-item>
      </v-sheet>

      <v-sheet class="border-b bg-white pb-3 mt-3">

        <v-row>
          <v-col cols="4">
            <v-sheet class="d-flex flex-column ga-4 px-7 py-4 h-100">

              <div class="d-flex justify-space-between align-center ga-3">
                <div class="d-flex align-center ga-3">
                  <v-icon size="small" icon="mdi-account-tie"/>
                  <div>Заказчик</div>
                </div>
                <v-icon size="small" icon="mdi-dots-horizontal" disabled/>
              </div>
              <v-divider/>
              <div class="d-flex flex-column ga-2">
                <div>
                  {{ assignmentCustomer }}
                </div>
                <div>
                  {{ assignmentCustomerInn }}
                </div>
              </div>
            </v-sheet>
          </v-col>
          <v-divider vertical/>
          <v-col cols="4">
            <v-sheet class="d-flex flex-column ga-4 px-7 py-4 h-100">
              <div class="d-flex justify-space-between align-center ga-3">
                <div class="d-flex align-center ga-3">
                  <v-icon size="small" icon="mdi-file-sign"/>
                  <div>Договор</div>
                </div>
                <v-icon size="small" icon="mdi-dots-horizontal" disabled/>
              </div>
              <v-divider/>
              <div class="d-flex flex-column ga-2">
                <div>
                  {{ assignment?.contract?.number }}
                </div>
                <div class="d-flex align-center ga-3">
                  <v-icon icon="mdi-calendar-range" size="x-small"/>
                  {{ assignmentContractDate }}
                </div>
              </div>
            </v-sheet>
          </v-col>
          <v-divider vertical/>
          <v-col cols="4">
            <v-sheet class="d-flex flex-column ga-4 px-7 py-4 h-100">
              <div class="d-flex justify-space-between align-center ga-3">
                <div class="d-flex align-center ga-3">
                  <v-icon size="small" icon="mdi-file-sign"/>
                  <div>Доп. соглашение</div>
                </div>
                <v-icon size="small" icon="mdi-dots-horizontal" disabled/>
              </div>
              <v-divider/>
              <div class="d-flex flex-column ga-2">
                <div>
                  {{ assignmentSubContract }}
                </div>
                <div class="d-flex align-center ga-3">
                  <v-icon icon="mdi-calendar-range" size="x-small"/>
                  {{ assignmentSubContractDate }}
                </div>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-sheet>

      <v-sheet class="border-b bg-white py-4 pl-4 pr-1">
        <div class="d-flex align-center">
          <v-btn
              prepend-icon="mdi-playlist-plus"
              color="blue-accent-4"
              variant="text"
              size="small"
              rounded="md"
              border
              @click="onAddBlock"
          >
            Добавить адрес
            <v-tooltip activator="parent" text="Добавить новую запись"/>
          </v-btn>
          <div class="mx-2"></div>
          <v-btn
              append-icon="mdi-chevron-down"
              variant="text"
              size="small"
              rounded="md"
              border
              :disabled="!selectedItems.length"
          >
            Операции
            <v-tooltip activator="parent" text="Операции с выделенными"/>
            <v-menu activator="parent" transition="scale-transition">
              <v-sheet rounded="md" class="mt-1" elevation="0" border>
                <v-list-item
                    append-icon="mdi-format-list-checks"
                    density="compact"
                    @click="selectedItems=[]"
                >
                  <template #append>
                    <v-icon icon="mdi-format-list-checks" size="small"/>
                  </template>
                  <v-list-item-title>Снять выделение</v-list-item-title>
                </v-list-item>
                <v-divider/>
                <v-list-item
                    append-icon="mdi-delete-sweep-outline"
                    density="compact"
                    @click=""
                >
                  <template #append>
                    <v-icon icon="mdi-delete-sweep-outline" size="small"/>
                  </template>
                  <v-list-item-title>Удалить выделенные</v-list-item-title>
                  <v-menu activator="parent" location="top right" width="205">
                    <v-sheet class="elevation-0 rounded-lg border-sm px-4 py-3">
                      <div>Подтвердите удаление</div>
                      <v-divider class="my-3 "/>
                      <div class="d-flex align-center ga-1">
                        <v-btn
                            density="comfortable"
                            class="rounded-lg"
                            variant="flat"
                            size="small"
                            border="sm"
                            text="Ок"
                            @click="onRemoveSomeBlocks"
                        />
                        <v-btn
                            density="comfortable"
                            class="rounded-lg"
                            variant="flat"
                            size="small"
                            text="Отмена"
                        />
                      </div>
                    </v-sheet>
                  </v-menu>
                </v-list-item>
              </v-sheet>
            </v-menu>
          </v-btn>
          <div class="mx-1"></div>
          <v-btn
              :loading="fetching"
              prepend-icon="mdi-update"
              variant="text"
              size="small"
              rounded="md"
              border
              @click="updateTable"
          >
            Обновить
            <v-tooltip activator="parent" text="Обновить данные"/>
          </v-btn>
          <v-spacer/>

          <v-progress-circular
              v-if="searching"
              color="grey"
              size="25"
              indeterminate
          />

          <v-text-field
              v-model="_searchText"
              v-bind="mySearchFieldStyle"
              style="max-width: 350px"
              @update:modelValue="updateSearch"
          />
        </div>
      </v-sheet>

      <v-data-table
          v-model="selectedItems"
          v-model:items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions"
          :items-per-page="itemsPerPage"
          :search="searchText"
          :headers="headers"
          :items="itemsMap"
          style="max-height: 400px"
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
        <template #item.actions="{ item }">
          <v-btn
              icon="mdi-open-in-new"
              density="comfortable"
              variant="text"
              size="small"
              @click.stop="onOpenBlockCard(item._id)"
          >
            <v-icon/>
            <v-tooltip activator="parent" location="left">
              Открыть карточку
            </v-tooltip>
          </v-btn>
          <my-change-button
              class="ml-2"
              prompt="Редактировать ТЗ"
              @click.stop="onBlockChange(item._id)"
          />
          <my-button-table-remove
              :prompt="'Удалить'"
              class="ml-2"
              @click:yes="onRemoveBlock(item._id)"
          />
        </template>
        <template #footer.prepend>
          <div class="mr-auto text-grey-darken-1 pl-4 mt-2" v-if="selectedItems.length">
            <v-icon icon="mdi-order-bool-ascending-variant" class="mr-1"/>
            Выбрано элементов: {{ selectedItems.length }}
          </div>
        </template>
      </v-data-table>
    </v-sheet>
  </v-container>
</template>

<script>
import {mySearchFieldStyle, navigateBackBtnStyle, myBtnPlus, myTableSheetStyle} from "../../../../configs/styles";
import {
  fetchAssignmentBlocks,
  removeSomeBlocks,
  sendAssignmentBlock
} from "../../../../utils/api/api_assignment_blocks";
import {unixDateToMiddleDateString, unixDateToShortDateString} from "../../../../utils/functions";
import {removeAssignmentBlock} from "@/utils/api/api_assignment_blocks";
import {fetchAssignmentOneById} from "@/utils/api/api_assignments";
import {navigateTo} from "nuxt/app";
import _ from "lodash";

export default {
  name: "assignment-card-page",

  data() {
    return {
      headers: [
        {
          title: 'Адрес',
          align: 'start',
          key: 'address',
          value: 'address',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Начало',
          align: 'start',
          key: 'start',
          value: 'start',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Инспектор',
          align: 'start',
          key: 'inspector',
          value: 'inspector',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Контакты инспектора',
          align: 'start',
          key: 'inspectorContacts',
          value: 'inspectorContacts',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          align: 'end',
          key: 'actions',
          sortable: false,
          minWidth: 150,
          maxWidth: 150,
          width: 150,
          nowrap: true,
        },
      ],
      items: [],
      selectedItems: [],
      fetching: false,
      searching: false,
      assignment: null,
      _searchText: '',
      searchText: '',
      itemsPerPage: 10,
      itemsPerPageOptions: [
        {value: 10, title: '10'},
        {value: 25, title: '25'},
        {value: 50, title: '50'},
      ],
      timeDateConfig: {
        weekday: 'short', // weekday: 'short',
        year: 'numeric',
        month: 'short', // month: 'short',
        day: 'numeric',
      },

      // IMPORT STYLES
      navigateBackBtnStyle,
      mySearchFieldStyle,
      myTableSheetStyle,
      myBtnPlus,
    }
  },

  beforeMount() {
    fetchAssignmentOneById(useRoute().params.assignmentId)
        .then(resp => {
          this.assignment = resp.data;
          this.fetchBlocks();
        })
        .catch(err => {
          console.log('Ошибка, такого задания не существует', err);
          this.$store.commit('alert/ERROR', 'Такого задания не существует');
          this.navigateBack();
        })
  },

  watch: {
    _searchText() {
      this.searching = true;
    }
  },

  computed: {

    itemsMap() {
      return this.itemsSearchFilter.map(e => ({
        _id: e._id,
        address: e?.address ?? '-',
        start: this.unixDateToMiddleDateString(e?.startDate),
        inspector: this.getInspector(e?.inspector),
        inspectorContacts: this.getInspectorContacts(e?.inspector),
      }))
    },

    itemsSearchFilter() {
      if (typeof this.searchText === 'string' && this.searchText.length > 0) {
        return this.items.filter(block => {
          return [
            block.title,
            block.description,
          ].filter(e => !!e).find(value => (new RegExp(this.searchText, 'ig')).test(value));
        });
      }
      return this.items;
    },

    assignmentCustomerInn() {
      const inn = this.assignment?.customer?.inn;
      return inn ? `ИНН: ${inn}` : '[ИНН не указан]';
    },

    assignmentCustomer() {
      return this.assignment?.customer?.shortName || '[Организация не указана]';
    },

    assignmentContractDate() {
      const date = this.assignment?.contract?.date;
      return date ? new Date(date).toLocaleDateString(undefined, this.timeDateConfig) : '[дата не указана]';
    },

    assignmentContract() {
      const number = this.assignment?.contract?.number;
      return number ? `№ ${number}` : '[Номер договора отсутствует]';
    },

    assignmentSubContract() {
      const num = this.assignment?.subContract?.number;
      return num ? num : '[Номер не указан]'
    },

    assignmentSubContractDate() {
      const date = this.assignment?.subContract?.date;
      return date ? new Date(date).toLocaleDateString(undefined, this.timeDateConfig) : '[дата не указана]';
    }
  },

  methods: {

    unixDateToMiddleDateString,
    unixDateToShortDateString,

    updateTable() {
      this.fetching = true;
      const timeoutId = setTimeout(() => {
        this.fetchBlocks();
        this.fetching = false;
        clearTimeout(timeoutId);
      }, 500)
    },

    updateSearch: _.debounce(function (search) {
      this.searchText = search;
      this.searching = false;
    }, 900),

    fetchBlocks() {
      this.fetching = true;
      fetchAssignmentBlocks(this.assignment._id)
          .then(response => {
            this.items = response.data ?? [];
          })
          .catch(err => {
            console.log('Ошибка получения списка объектов', err);
            this.$store.commit('alert/ERROR', 'Ошибка получения списка объектов');
          })
          .finally(() => {
            this.fetching = false;
            this.selectedItems = [];
          })
    },

    // table fields
    getInspector(inspector) {
      if (!inspector?.surname && !inspector?.firstName && !inspector?.lastName) return '-';
      return `${inspector?.surname || ''} ${inspector?.firstName || ''} ${inspector?.lastName || ''}`;
    },

    getInspectorContacts(inspector) {
      if (!inspector?.phoneNumber && !inspector?.email) return '-';
      return `${inspector?.phoneNumber} | ${inspector?.email}`;
    },

    onAddBlock() {
      if (!this.assignment._id) {
        this.$store.commit('alert/ERROR', 'Ошибка при добавлении адреса, отсутствует id задания');
        return;
      }
      sendAssignmentBlock(this.assignment._id, {
        _id: null,
        title: '[пустой]', // Заголовок
        address: null, // Адрес
        startDate: null, // Дата начала
        pledger: null, // Залогодатель
        contact: null, // Контакт
        inspector: null, // Инспектор
      }).then(() => {
        this.$store.commit('alert/SUCCESS', 'Добавлен новый адрес осмотра');
        this.selectedItems = [];
        this.fetchBlocks();
      }).catch((err) => {
        this.$store.commit('alert/ERROR', 'Ошибка добавления нового адреса');
        console.log('Ошибка добавления', err);
      })
    },

    onOpenBlockCard(id) {
      navigateTo(`${id}/`);
    },

    onBlockChange(id) {
      navigateTo(`${id}/change`);
    },

    onRemoveSomeBlocks() {
      if (!this.selectedItems || this.selectedItems.length === 0) return;
      removeSomeBlocks()
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Записи удалены');
            this.selectedItems = [];
            this.fetchBlocks();
          })
          .catch(err => {
            console.log('Ошибка удаления записей', err);
            this.$store.commit('alert/ERROR', 'Ошибка удаления записей');
          })
    },

    onRemoveBlock(blockID) {
      removeAssignmentBlock(blockID)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Адрес успешно удален');
            this.selectedItems = [];
            this.fetchBlocks();
          })
          .catch(err => {
            this.$store.commit('alert/ERROR', 'Не удалось удалить адрес');
            console.log('Ошибка удаления адреса', err);
          })
    },

    navigateBack() {
      navigateTo(`/manager/assignments`);
    },
  }
}
</script>