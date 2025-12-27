<template>
  <v-container fluid class="bg-white">
    <v-sheet max-width="1280" class="bg-transparent">

      <v-sheet class="border-b bg-white pb-3">
        <v-card-title class="">Заказчики</v-card-title>
        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-card-account-details-outline" size="small"/>
          Добавляйте заказчиков в таблицу и работайте в привычном формате
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
              @click="handleCreateCustomer"
          >
            Добавить заказчика
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
                            @click="handleRemoveCustomers"
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
          v-model:page="page"
          v-bind="{...commonTableConfig, headers, items: itemsFiltered, loading}"
      >
        <template v-slot:item.actions="{ item }">
          <my-change-button
              prompt="Редактировать ТЗ"
              @click.stop="navigateTo(`/manager/customers/${item._id}/change`)"
          />
          <my-button-table-remove
              prompt="Удалить"
              @click:yes="handleRemoveCustomer(item._id)"
              class="ml-2"
          />
        </template>

        <template #item.member="{ item }">
          <div>{{ item.memberFullName }}</div>
          <div class="text-grey-darken-1">{{ item.memberPosition }}</div>
        </template>

        <template #item.contacts="{ item }">
          <div>{{ item.email }}</div>
          <div>{{ item.phoneNumberWork }}</div>
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
import {navigateTo} from "nuxt/app";
import {customerTableHeaders as headers} from "@/constants/customer-table-headers";
import useCustomersApi from "@/composables/use-customers-api";
import {useStore} from "vuex";
import {commonTableConfig} from "@/configs/common-table-config.js";


const vuexStore = useStore();
const customers = ref([]);
const loading = ref(false);
const selected = ref([]);
const searchQuery = ref('');
const {
  fetchAll: fetchAllCustomers,
  create: createCustomer,
  removeOne: removeOneCustomer,
  removeMany: removeManyCustomers
} = useCustomersApi();
const itemsPerPage = ref(10);
const page = ref(1);


onMounted(() => {
  updateTable();
});


const itemsFiltered = computed(() => {
  if (!searchQuery.value) return customers.value;
  const searchRegex = new RegExp(customers.value, 'i');
  return customers.value.filter(e => {
    const join = [
      e?.fullName,
      e?.shortName,
      e?.inn,
      e?.ogrn,
      e?.memberFullName,
      e?.address
    ].filter(e => !!e).join(' ');
    return searchRegex.test(join);
  })
});


function updateTable() {
  loading.value = true;
  return fetchAllCustomers()
      .then(resp => {
        customers.value = resp.data || [];
      })
      .catch(e => {
        console.log('Ошибка запроса данных', e);
        vuexStore.commit('alert/ERROR', 'Ошибка загрузки данных');
      })
      .finally(() => {
        loading.value = false;
        selected.value = [];
      });
}

function handleCreateCustomer() {

  const data = {
    shortName: null,
    fullName: null,
    inn: null,
    ogrn: null,
    legalAddress: null,
    physicalAddress: null,
    email: null,
    phoneNumber: null,
    memberFullName: null,
    memberPosition: null,
  }

  loading.value = true;

  return createCustomer(data)
      .then((r) => successHandler(r, 'Добавлен новый заказчик'))
      .catch((e) => errorHandler(e))
      .finally(finallyHandler);
}

function handleRemoveCustomer(id) {
  loading.value = true;
  return removeOneCustomer(id)
      .then((r) => successHandler(r, 'Заказчик успешно удален'))
      .catch((e) => errorHandler(e))
      .finally(finallyHandler);
}

function handleRemoveCustomers() {
  loading.value = true;
  return removeManyCustomers(selected.value)
      .then((r) => successHandler(r, 'Записи удалены'))
      .catch((e) => errorHandler(e))
      .finally(finallyHandler);
}


function successHandler(r, msg) {
  vuexStore.commit('alert/SUCCESS', msg || 'Записи удалены');
  updateTable();
  return r;
}

function errorHandler(e, msg) {
  console.log('Ошибка удаления записей', e);
  vuexStore.commit('alert/ERROR', msg || e.response?.data?.message || 'Неизвестная ошибка');
}

function finallyHandler() {
  loading.value = false;
}
</script>