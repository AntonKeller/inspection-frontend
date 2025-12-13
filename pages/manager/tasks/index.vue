<template>
  <v-container fluid class="bg-white">
    <v-sheet max-width="1280" class="bg-transparent">

      <v-sheet class="border-b bg-white pb-3">
        <v-card-title class="">Список заданий</v-card-title>
        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-calendar-check-outline" size="small"/>
          Добавляйте и контролируйте задания на осмотр
        </v-card-subtitle>
      </v-sheet>

      <v-sheet class="border-b bg-white py-4 pl-4 pr-1">
        <div class="d-flex align-center">
          <v-btn
              class="border rounded "
              prepend-icon="mdi-playlist-plus"
              color="blue-accent-4"
              variant="text"
              size="small"
              @click="handleCreateTask"
          >
            Добавить задание
            <v-tooltip activator="parent" text="Добавить новую запись"/>
          </v-btn>
          <div class="mx-2"></div>

          <v-btn
              append-icon="mdi-chevron-down"
              variant="text"
              size="small"
              rounded="md"
              border
              :disabled="!selected.length"
          >
            Операции
            <v-tooltip activator="parent" text="Операции с выделенными"/>
            <v-menu activator="parent" transition="scale-transition">
              <v-sheet rounded="md" class="mt-1" elevation="0" border>
                <v-list-item
                    append-icon="mdi-format-list-checks"
                    density="compact"
                    @click="selected=[]"
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
                            @click="handleRemoveManyTasks"
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
              v-model="searchQuery"
              v-bind="mySearchFieldStyle"
              style="max-width: 350px"
          />
        </div>
      </v-sheet>

      <v-data-table
          v-model="selected"
          v-model:items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions"
          :items-per-page="itemsPerPage"
          :items="tasksSearchFilter"
          :search="searchQuery"
          :headers="taskTableHeaders"
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
        <!--        <template #item.title="{ item }">-->
        <!--          <v-icon-->
        <!--              icon="mdi-label-multiple-outline"-->
        <!--              size="small"-->
        <!--              color="grey-darken-1"-->
        <!--              class="mr-1"-->
        <!--          />-->
        <!--          {{ item?.title ?? '-' }}-->
        <!--        </template>-->

        <!--        <template #item.customerShortName="{ item }">-->
        <!--          <v-chip-->
        <!--              :prepend-icon="item?.customer?.shortName ? 'mdi-domain' : ''"-->
        <!--              :text="item.customerShortName"-->
        <!--              color="blue-darken-4"-->
        <!--              class="text-caption"-->
        <!--              density="compact"-->
        <!--              size="small"-->
        <!--              label-->
        <!--          />-->
        <!--        </template>-->

        <!--        <template #item.assignmentContract="{ item }">-->
        <!--          <v-chip-->
        <!--              :prepend-icon="item?.contract ? 'mdi-domain' : ''"-->
        <!--              :text="item.assignmentContract"-->
        <!--              color="deep-purple-darken-2"-->
        <!--              class="text-caption"-->
        <!--              density="compact"-->
        <!--              size="small"-->
        <!--              label-->
        <!--          />-->
        <!--        </template>-->

        <template #item.actions="{ item }">
          <v-btn
              icon="mdi-open-in-new"
              density="comfortable"
              variant="text"
              size="small"
              @click.stop="navigateTo(`/manager/tasks/${item._id}/`)"
          >
            <v-icon/>
            <v-tooltip activator="parent" location="left">
              Открыть карточку
            </v-tooltip>
          </v-btn>
          <my-change-button
              class="ml-2"
              prompt="Редактировать ТЗ"
              @click.stop="navigateTo(`/manager/tasks/${item._id}/change`)"
          />
          <my-button-table-remove
              :prompt="'Удалить'"
              class="ml-2"
              @click:yes="handleRemoveOneTask(item._id)"
          />
        </template>

        <template #footer.prepend>
          <div class="mr-auto text-grey-darken-1 pl-4 mt-2" v-if="selected.length">
            <v-icon icon="mdi-order-bool-ascending-variant" class="mr-1"/>
            Выбрано элементов: {{ selected.length }}
          </div>
        </template>
      </v-data-table>
    </v-sheet>
  </v-container>
</template>

<script setup>
import {mySearchFieldStyle} from "@/configs/styles";
import {unixDateToShortDateString} from "@/utils/functions";
import {navigateTo} from "nuxt/app";
import useTasksApi from "@/composables/use-tasks-api";
import {useStore} from "vuex";
import taskTableHeaders from "@/constants/task-table-headers";
import {itemsPerPage, itemsPerPageOptions} from "@/constants/table-options";


const {
  fetchAll: fetchAllTasks,
  create: createTask,
  removeMany: removeManyTasks,
  removeOne: removeOneTask
} = useTasksApi();


const vuexStore = useStore();
const tasks = ref([]);
const selected = ref([]);
const fetching = ref(false);
const searchQuery = ref('');
const searching = ref(false);


onMounted(() => {
  updateTable();
});


const tasksSearchFilter = computed(() => {
  if (!searchQuery.value) return tasks.value;
  const searchRegex = new RegExp(searchQuery.value, 'i');
  return tasks.value.filter(item => {
    const row = [
      item?.title,
      item?.description,
      item?.contract?.customer?.fullName,
      item?.contract?.customer?.inn
    ].filter(e => !!e).join(' ');
    return searchRegex.test(row);
  })
});


function updateTable() {
  fetching.value = true;
  fetchAllTasks()
      .then(resp => {
        tasks.value = resp.data || [];
        console.log(resp.data)
        console.log(tasks.value)
      })
      .catch(e => {
        vuexStore.commit('alert/ERROR', 'Ошибка запроса данных');
      })
      .finally(() => {
        fetching.value = false;
      });
}

function getContractString(contract) {
  const a = contract?.number;
  const b = contract?.date;
  if (!a && !b) return '-';
  if (a && !b) return `№ ${contract?.number} от [дата отсутствует]`;
  if (!a && b) return `[№ отсутствует] от ${unixDateToShortDateString(contract?.date)}`;
  if (a && b) return `№ ${contract?.number} от ${unixDateToShortDateString(contract?.date)}`;
}

function handleCreateTask() {
  const task = {
    title: null,                // Заголовок задачи
    customerId: null,           // Заказчик
    agreementId: null,          // Договор
    loanAgreementsIds: null,    // Кредитный договор
    pledgeAgreementsIds: null,  // Договор залога
  }
  createTask(task)
      .then(resp => {
        vuexStore.commit('alert/SUCCESS', 'Задание добавлено');
        updateTable();
      })
      .catch(e => {
        vuexStore.commit('alert/ERROR', 'Ошибка добавления');
      })
      .finally(() => {
        selected.value = [];
      });
}

function handleRemoveOneTask(id) {
  return removeOneTask(id)
      .then(resp => {
        vuexStore.commit('alert/SUCCESS', 'Запись удалена');
        updateTable();
        return resp;
      })
      .catch(e => {
        vuexStore.commit('alert/ERROR', 'Ошибка удаления');
        return [];
      })
      .finally(() => {
        selected.value = [];
      });
}

function handleRemoveManyTasks() {
  if (!selected.value || selected.value.length === 0) return;
  return removeManyTasks(selected.value)
      .then(resp => {
        vuexStore.commit('alert/SUCCESS', 'Записи удалены');
        updateTable();
        return resp;
      })
      .catch(e => {
        vuexStore.commit('alert/ERROR', 'Ошибка удаления');
        return [];
      })
      .finally(() => {
        selected.value = [];
      });
}
</script>