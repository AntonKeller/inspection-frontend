<template>
  <v-container fluid class="bg-white">
    <v-sheet max-width="1080" class="bg-transparent">


      <v-sheet class="border-b bg-white pb-3">

        <div class="pl-3 mb-4">
          <v-btn
              v-bind="navigateBackBtnStyle"
              v-tooltip="'Вернуться назад'"
              text="Назад"
              @click="navigateBack"
          />
        </div>

        <v-card-title>{{ task?.title }}</v-card-title>

        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-checkbox-marked-circle-auto-outline" size="small"/>
          Текущее задание
        </v-card-subtitle>


      </v-sheet>

      <v-sheet class="border-b bg-white pb-3 mt-3">
        <v-row>
          <v-col cols="12" md="6">
            <v-sheet class="d-flex flex-column ga-4 px-7 py-4 h-100">

              <div class="d-flex justify-space-between align-center ga-3">
                <div class="d-flex align-center ga-3">
                  <v-icon size="small" icon="mdi-account-tie"/>
                  <div class="font-weight-bold text-body-2">Заказчик</div>
                </div>
                <v-icon size="small" icon="mdi-dots-horizontal" disabled/>
              </div>
              <v-divider/>
              <div class="d-flex flex-column ga-2">
                <div>{{ task?.customer?.fullName || 'Заказчик не указан' }}</div>
                <div>{{ task?.customer?.inn ? 'ИНН: ' + task?.customer?.inn : 'ИНН не указан' }}</div>
              </div>
            </v-sheet>
          </v-col>
          <v-divider vertical/>
          <v-col cols="12" md="6">
            <v-sheet class="d-flex flex-column ga-4 px-7 py-4 h-100">
              <div class="d-flex justify-space-between align-center ga-3">
                <div class="d-flex align-center ga-3">
                  <v-icon size="small" icon="mdi-file-sign"/>
                  <div class="font-weight-bold text-body-2">Договор</div>
                </div>
                <v-icon size="small" icon="mdi-dots-horizontal" disabled/>
              </div>
              <v-divider/>
              <div class="d-flex flex-column ga-2">
                <div>
                  {{ task?.agreement?.number ? `№ ${task?.agreement?.number}` : 'Не указан номер договора' }}
                </div>
                <div class="d-flex align-center ga-3">
                  <v-icon icon="mdi-calendar-range" size="x-small"/>
                  {{ new Date(task?.agreement?.date).toLocaleDateString() || 'Не указана дата договора' }}
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
              @click="handleCreateAddress"
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
                            @click="handleRemoveManyAddresses"
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
          v-bind="{...commonTableConfig, headers, items: addressesFiltered, loading}"
      >
        <template #item.actions="{ item }">
          <v-btn
              icon="mdi-open-in-new"
              density="comfortable"
              variant="text"
              size="small"
              @click.stop="navigateTo(`${item._id}/`)"
          >
            <v-icon/>
            <v-tooltip activator="parent" location="left">
              Открыть карточку
            </v-tooltip>
          </v-btn>
          <my-change-button
              class="ml-2"
              prompt="Редактировать ТЗ"
              @click.stop="navigateTo(`${item._id}/change`)"
          />
          <my-button-table-remove
              :prompt="'Удалить'"
              class="ml-2"
              @click:yes="handleRemoveAddress(item._id)"
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
import {mySearchFieldStyle, navigateBackBtnStyle} from "../../../../configs/styles";
import {targetAddressesTableHeaders as headers} from "../../../../constants/target-addresses-table-headers";
import useTasksApi from "../../../../composables/use-tasks-api";
import useTargetAddressesApi from "../../../../composables/use-target-addresses-api";
import {commonTableConfig} from "@/configs/common-table-config.ts";
import {useStore} from "vuex";


const vuexStore = useStore();
const task = ref({});
const targetAddresses = ref([]);
const selected = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const itemsPerPage = ref(10);
const page = ref(1);
const {
  fetchOne: fetchOneTask
} = useTasksApi();
const {
  create: createAddress,
  fetchAllByTask: fetchAllTargetAddressesByTask,
  removeOne: removeOneAddress,
  removeMany: removeManyAddresses
} = useTargetAddressesApi();


onMounted(async () => {
  await handleFetchOneTask(useRoute().params.taskId);
  await updateTable();
});


const emptyAddress = computed(() => ({
  title: null,
  startDate: null,
  address: null,
  pledgerId: null,
  contactId: null,
  employerId: null,
  taskId: task.value._id
}))


const addressesFiltered = computed(() => {
  if (!searchQuery.value) return targetAddresses.value;
  const searchRegex = new RegExp(searchQuery.value, 'i');
  return targetAddresses.value.filter((e) => {
    const pledger = e.pledger
        ? `${e.pledger.firstName} ${e.pledger.surname} ${e.pledger.lastName} ${e.pledger.inn}`.trim()
        : '';
    const contact = e.contact
        ? `${e.contact.firstName} ${e.contact.surname} ${e.contact.lastName}`.trim()
        : '';
    const employer = e.employer
        ? `${e.employer.firstName} ${e.employer.surname} ${e.employer.lastName} ${e.employer.email}`.trim()
        : '';
    return searchRegex.test([
      e.title || '',
      e.address || '',
      pledger,
      contact,
      employer
    ].join(' '));
  });
});

// const customer = computed(() => task.value.customer);
// const customerINN = computed(() => customer.value?.inn);
// const agreementNum = computed(() => task.value?.agreement?.number);
// const agreementDate = computed(() => task.value?.agreement?.date);


function handleFetchOneTask(id) {
  if (!id) return;
  return fetchOneTask(id)
      .then((r) => successHandler(r, null, () => task.value = r.data || {}))
      .catch(e => errorHandler(e, 'Не удалось загрузить задание', navigateBack));
}

function updateTable() {
  if (!task.value._id) return;
  return fetchAllTargetAddressesByTask(task.value._id)
      .then((r) => successHandler(r, null, () => targetAddresses.value = r.data || []))
      .catch(e => errorHandler(e, 'Не удалось загрузить адреса'))
      .finally(finallyHandler);
}

function navigateBack() {
  navigateTo(`/manager/tasks/`);
}

function handleCreateAddress() {
  if (!task.value._id) return;
  loading.value = true;
  return createAddress(emptyAddress.value)
      .then((r) => successHandler(r, null, updateTable))
      .catch(e => errorHandler(e, 'Ошибка добавления адреса'))
      .finally(finallyHandler);
}

function handleRemoveAddress(id) {
  if (!id) return;
  loading.value = true;
  return removeOneAddress(id)
      .then((r) => successHandler(r, 'Адрес успешно удален', updateTable))
      .catch(e => errorHandler(e, 'Ошибка удаления адреса'))
      .finally(finallyHandler);
}

function handleRemoveManyAddresses() {
  if (!Array.isArray(selected.value) || selected.value.length === 0) return;
  loading.value = true;
  return removeManyAddresses(selected.value)
      .then((r) => successHandler(r, 'Адреса успешно удалены', updateTable))
      .catch(e => errorHandler(e, 'Ошибка удаления адресов'))
      .finally(finallyHandler);
}


function successHandler(r, msg, callback) {
  if (msg) vuexStore.commit('alert/SUCCESS', msg);
  if (callback) callback();
  return r;
}

function errorHandler(e, msg, callback) {
  console.log('Ошибка', e);
  vuexStore.commit('alert/ERROR', msg || e.response?.data?.message || 'Неизвестная ошибка');
  if (callback) callback();
}

function finallyHandler() {
  loading.value = false;
  selected.value = [];
}
</script>