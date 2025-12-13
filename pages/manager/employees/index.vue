<template>
  <v-container fluid class="bg-white">
    <v-sheet max-width="1280" class="bg-transparent">

      <v-sheet class="border-b bg-white pb-3">
        <v-card-title class="">Сотрудники</v-card-title>
        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-badge-account-outline" size="small"/>
          Добавляйте, редактируйте данные ваших сюрвейеров
        </v-card-subtitle>
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
              @click="handleCreateEmployer"
          >
            Добавить сотрудника
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
                  <v-list-item-title>Удалить</v-list-item-title>
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
                            @click="handleRemoveEmployees"
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
              :loading="loading"
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
              v-if="loading"
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
          :items="employeesSearchFiltered"
          :headers="employeesTableHeaders"
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
        <template #item.name="{ item }">
          {{ getFullName(item) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <my-change-button
              prompt="Редактировать"
              @click.stop="navigateTo(`/manager/employees/${item._id}/change`)"
          />
          <my-button-table-remove
              prompt="Удалить"
              @click:yes="handleRemoveEmployer(item._id)" class="ml-2"
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
import {itemsPerPage, itemsPerPageOptions} from "@/constants/table-options";
import employeesTableHeaders from "@/constants/employees-table-headers";
import {useStore} from "vuex";
import {mySearchFieldStyle} from "@/configs/styles";
import useEmployeesApi from "@/composables/use-employees-api";


const vuexStore = useStore();
const employees = ref([]);
const loading = ref(false);
const selected = ref([]);
const searchQuery = ref('');
const {
  fetchAll: fetchAllEmployees,
  create: createEmployer,
  removeOne: removeOneEmployer,
  removeMany: removeManyEmployees
} = useEmployeesApi();


onBeforeMount(() => {
  updateTable();
});

const employeesSearchFiltered = computed(() => {
  if (!searchQuery.value) return employees.value;
  const searchRegex = new RegExp(searchQuery.value, 'i');
  return employees.value.filter((e) => {
    const join = [
      e?.firstName,
      e?.surname,
      e?.lastName,
      e?.phoneNumber,
      e?.email,
    ].filter(e => !!e).join(' ');
    return searchRegex.test(join);
  })
})

function updateTable() {
  loading.value = true;
  return fetchAllEmployees()
      .then((resp) => {
        employees.value = resp.data || [];
      })
      .catch(e => {
        console.log('Ошибка получения списка сотрудников', e);
        vuexStore.commit('alert/ERROR', 'Ошибка получения списка сотрудников');
      })
      .finally(() => {
        loading.value = false;
        selected.value = [];
      })
}

function getFullName(user) {
  return `${user?.surname ?? ''} ${user?.firstName ?? ''} ${user?.lastName ?? ''}`;
}


function handleCreateEmployer() {

  const employer = {
    firstName: null,
    surname: null,
    lastName: null,
    phoneNumberWork: null,
    phoneNumber: null,
    email: null,
    login: null,
    password: null,
    roleId: null,
  }

  loading.value = true;

  return createEmployer(employer)
      .then((resp) => {
        updateTable();
        vuexStore.commit('alert/SUCCESS', 'Сотрудник добавлен');
      })
      .catch(e => {
        console.log('Ошибка получения списка сотрудников', e);
        vuexStore.commit('alert/ERROR', 'Ошибка добавления');
      })
      .finally(() => {
        loading.value = false;
        selected.value = [];
      });
}

function handleRemoveEmployer(id) {
  if (!id) return;
  return removeOneEmployer(id)
      .then(() => {
        vuexStore.commit('alert/SUCCESS', 'Документ успешно удален');
        updateTable();
      })
      .catch(() => {
        vuexStore.commit('alert/ERROR', 'Ошибка удаления');
      })
      .finally(() => {
        selected.value = [];
      });
}

function handleRemoveEmployees() {
  if (!Array.isArray(selected.value) || selected.value.length === 0) return;
  return removeManyEmployees(selected.value)
      .then(() => {
        vuexStore.commit('alert/SUCCESS', 'Документы успешно удалены');
        updateTable();
      })
      .catch(() => {
        vuexStore.commit('alert/ERROR', 'Ошибка удаления');
      })
      .finally(() => {
        selected.value = [];
      });
}
</script>