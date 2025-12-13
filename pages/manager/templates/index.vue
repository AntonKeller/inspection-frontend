<template>
  <v-container fluid class="bg-white">
    <v-sheet max-width="1280" class="bg-transparent">

      <v-sheet class="border-b bg-white pb-3">
        <v-card-title class="">Шаблоны и Ракурсы</v-card-title>
        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-folder-table-outline" size="small"/>
          Редактируйте, создавайте шаблоны, типы объектов и ракурсы под требования заказчика
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
              @click="handleCreateTemplate"
          >
            Добавить шаблон
            <v-tooltip activator="parent" text="Добавить новую запись"/>
          </v-btn>

          <div class="mx-3"></div>

          <v-btn
              append-icon="mdi-chevron-down"
              variant="text"
              size="small"
              rounded="md"
              border
              :disabled="!templatesSelected.length"
          >
            Операции
            <v-tooltip activator="parent" text="Операции с выделенными"/>
            <v-menu activator="parent" transition="scale-transition">
              <v-sheet rounded="md" class="mt-1" elevation="0" border>
                <v-list-item
                    append-icon="mdi-format-list-checks"
                    density="compact"
                    @click="templatesSelected=[]"
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
                    @click="handleRemoveManyTemplates"
                >
                  <template #append>
                    <v-icon icon="mdi-delete-sweep-outline" size="small"/>
                  </template>
                  <v-list-item-title>Удалить</v-list-item-title>
                </v-list-item>
              </v-sheet>
            </v-menu>
          </v-btn>

          <div class="mx-1"></div>

          <v-btn
              :loading="templatesLoading"
              prepend-icon="mdi-update"
              variant="text"
              size="small"
              rounded="md"
              border
              @click="updateTemplatesTable"
          >
            Обновить
            <v-tooltip activator="parent" text="Обновить данные"/>
          </v-btn>

          <v-spacer/>

          <v-text-field
              v-model="templatesSearchQuery"
              v-bind="mySearchFieldStyle"
              style="max-width: 350px"
          />
        </div>
      </v-sheet>

      <v-data-table
          v-model="templatesSelected"
          v-model:items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions"
          :items-per-page="itemsPerPage"
          :items="templatesSearchFiltered"
          :headers="templatesTableHeaders"
          :loading="templatesLoading"
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
          @update:current-items="templatesSelected = []"
      >
        <template #item.actions="{ item }">
          <v-btn
              icon="mdi-open-in-new"
              density="comfortable"
              variant="text"
              size="small"
              @click.stop="openObjectTypesMenu(item._id)"
          >
            <v-icon/>
            <v-tooltip activator="parent" location="left">
              Открыть шаблон шаблон
            </v-tooltip>
          </v-btn>
          <my-change-button
              class="ml-2"
              prompt="Редактировать шаблон"
              @click.stop="handleChangeTemplate(item._id)"
          />
          <my-button-table-remove
              :prompt="'Удалить'"
              class="ml-2"
              @click:yes="handleRemoveOneTemplate(item._id)"
          />
        </template>

        <template #footer.prepend>
          <div class="mr-auto text-grey-darken-1 pl-4 mt-2" v-if="templatesSelected.length">
            <v-icon icon="mdi-order-bool-ascending-variant" class="mr-1"/>
            Выбрано элементов: {{ templatesSelected.length }}
          </div>
        </template>
      </v-data-table>

      <v-overlay v-model="objectTypesMenuIsOpen" class="d-flex justify-center align-center ma-4">
        <v-sheet class="d-flex flex-column ga-4 pa-4 h-100 rounded-lg" width="100%">
          <v-chip text="Типы и ракурсы объектов" color="blue-darken-1" variant="flat" label/>
          <div class="d-flex ga-1">
            <v-btn
                prepend-icon="mdi-tray-arrow-down"
                color="blue-accent-4"
                variant="text"
                size="small"
                rounded="md"
                border
                :loading="downloadTemplateLoading"
                :disabled="downloadTemplateLoading"
                @click="handleDownloadTemplate"
            >
              Скачать шаблон
              <v-tooltip activator="parent" text="Скачать шаблон"/>
            </v-btn>
            <v-btn
                prepend-icon="mdi-tray-arrow-up"
                color="blue-accent-4"
                variant="text"
                size="small"
                rounded="md"
                border
                @click="$refs.inputFile.click()"
            >
              Загрузить типы
              <v-tooltip activator="parent" text="Загрузить шаблон"/>
            </v-btn>
            <v-btn
                :loading="templatesLoading"
                prepend-icon="mdi-update"
                variant="text"
                size="small"
                rounded="md"
                border
                @click="updateObjectTypesTable"
            >
              Обновить
              <v-tooltip activator="parent" text="Обновить данные"/>
            </v-btn>
          </div>

          <v-sheet class="pr-4 overflow-y-scroll" max-height="350">
            <v-card
                v-for="type of objectTypes"
                :key="type._id"
                class="mt-2 border rounded-lg"
                variant="text"
                density="compact"
            >
              <v-card-title class="text-caption">
                <v-icon icon="mdi-zip-box-outline" size="20"/>
                {{ type.name }}
              </v-card-title>
              <v-card-text class="d-flex ga-2 flex-wrap">
                <v-chip
                    v-for="angle of type.angles"
                    color="blue-darken-1"
                    density="comfortable"
                    size="small"
                    variant="outlined"
                    :text="angle.name"
                />
              </v-card-text>
            </v-card>
          </v-sheet>

        </v-sheet>
      </v-overlay>

      <!--      <v-overlay v-model="changeTemplateOverlay" class="d-flex justify-center align-center">-->
      <!--        <v-sheet rounded="lg" width="600px">-->
      <!--          <v-card-item>Редактирование заголовка</v-card-item>-->
      <!--          <v-card-item>-->
      <!--            <v-form v-model="changeTemplateFormIsValid" ref="changeTemplateForm" class="d-flex flex-column mt-2">-->
      <!--              <v-row dense>-->
      <!--                <v-col :cols="12">-->
      <!--                  <v-text-field-->
      <!--                      v-model="selectedTemplate.title"-->
      <!--                      v-bind="inputFieldStyle"-->
      <!--                      label="Заголовок"-->
      <!--                  />-->
      <!--                </v-col>-->
      <!--              </v-row>-->
      <!--            </v-form>-->
      <!--          </v-card-item>-->
      <!--          <v-card-actions>-->
      <!--            <my-btn-submit-->
      <!--                text="Принять"-->
      <!--                prepend-icon="mdi-checkbox-multiple-marked-outline"-->
      <!--                @click="onChangeTemplate"-->
      <!--            />-->
      <!--          </v-card-actions>-->
      <!--        </v-sheet>-->
      <!--      </v-overlay>-->

      <v-file-input
          v-model="templateFile"
          class="d-none"
          ref="inputFile"
          accept=".xlsx"
          @change="handleUploadTemplate"
      />

    </v-sheet>
  </v-container>
</template>

<script setup>
import {mySearchFieldStyle} from "@/configs/styles";
import {useStore} from "vuex";
import useTemplatesApi from "@/composables/use-templates-api";
import {itemsPerPage, itemsPerPageOptions} from "@/constants/table-options";
import templatesTableHeaders from "@/constants/templates-table-headers";
import useObjectTypesApi from "@/composables/use-object-types-api";
import useAnglesApi from "@/composables/use-angles-api";

const vuexStore = useStore();
const {
  fetchAll: fetchAllTemplates,
  create: createTemplate,
  removeMany: removeManyTemplates,
  removeOne: removeOneTemplate,
  downloadTemplate,
  uploadTemplate,
} = useTemplatesApi();

const {
  fetchMappedAllByTemplate: fetchMappedObjectTypesByTemplate,
  removeMany: removeManyObjectTypes,
  removeOne: removeOneObjectType,
} = useObjectTypesApi();

const {
  fetchAllByObjectType: fetchAllAnglesByObjectType,
  removeMany: removeManyAngles,
  removeOne: removeOneAngle
} = useAnglesApi();

const inputFile = ref();
const templateFile = ref();
const templates = ref([]);
const templatesSearchQuery = ref('');
const templatesLoading = ref(false);
const templatesSelected = ref([]);
const downloadTemplateLoading = ref(false);
const uploadTemplateLoading = ref(false);
const activeTemplateId = ref(null);

const objectTypes = ref([]);
const objectTypesSearchQuery = ref('');
const objectTypesLoading = ref(false);
const objectTypesSelected = ref([]);
const objectTypesMenuIsOpen = ref(false);

const angles = ref([]);
const anglesSearchQuery = ref('');
const anglesLoading = ref(false);
const anglesSelected = ref([]);
const anglesMenuIsOpen = ref(false);


onMounted(() => {
  updateTemplatesTable();
});


const templatesSearchFiltered = computed(() => {
  if (!templatesSearchQuery.value) return templates.value;
  const templatesSearchRegex = new RegExp(templatesSearchQuery.value, 'i');
  return templates.value.filter(e => {
    const join = [
      e.name
    ].filter(e => !!e).join(' ');
    return templatesSearchRegex.test(join);
  });
});

const objectTypesSearchFiltered = computed(() => {
  if (!objectTypesSearchQuery.value) return objectTypes.value;
  const objectTypesSearchRegex = new RegExp(objectTypesSearchQuery.value, 'i');
  return objectTypes.value.filter(e => {
    const join = [
      e.name
    ].filter(e => !!e).join(' ');
    return objectTypesSearchRegex.test(join);
  });
});

const anglesSearchFiltered = computed(() => {
  if (!anglesSearchQuery.value) return angles.value;
  const anglesSearchRegex = new RegExp(anglesSearchQuery.value, 'i');
  return angles.value.filter(e => {
    const join = [
      e.name
    ].filter(e => !!e).join(' ');
    return anglesSearchRegex.test(join);
  });
});


function updateTemplatesTable() {
  templatesLoading.value = true;
  return fetchAllTemplates()
      .then((resp) => {
        templates.value = resp.data || [];
      })
      .catch(e => {
        console.log('Ошибка получения шаблонов', e);
      })
      .finally(() => {
        templatesLoading.value = false;
        templatesSelected.value = [];
      });
}

function handleCreateTemplate() {
  templatesLoading.value = true;
  return createTemplate({name: null, isBase: false})
      .then(() => {
        updateTemplatesTable();
      })
      .catch(e => {
        console.log('Ошибка получения шаблонов', e);
      })
}

function updateObjectTypesTable() {
  if (!activeTemplateId.value) return;
  objectTypesLoading.value = true;
  return fetchMappedObjectTypesByTemplate(activeTemplateId.value)
      .then((resp) => {
        objectTypes.value = resp.data || [];
      })
      .catch(e => {
        console.log('Ошибка получения типо объектов', e);
      })
      .finally(() => {
        objectTypesLoading.value = false;
        objectTypesSelected.value = [];
      })
}

function updateAnglesTable(objectTypeId) {
  anglesLoading.value = true;
  return fetchAllAnglesByObjectType(objectTypeId)
      .then((resp) => {
        angles.value = resp.data || [];
      })
      .catch(e => {
        console.log('Ошибка получения ракурсов', e);
      })
      .finally(() => {
        anglesLoading.value = false;
        anglesSelected.value = [];
      })
}

function handleDownloadTemplate() {
  downloadTemplateLoading.value = true;
  return downloadTemplate()
      .then(resp => {
        const url = window.URL.createObjectURL(new Blob([resp.data]));

        // Создаем временную ссылку для скачивания
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'template.xlsx'); // имя файла
        document.body.appendChild(link);
        link.click();

        // Убираем ссылку и освобождаем память
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

        return resp;
      })
      .catch(e => {
        console.log('Ошибка загрузки', e);
        vuexStore.commit('alert/ERROR', 'Не удалось скачать файл');
      })
      .finally(() => {
        downloadTemplateLoading.value = false;
      });
}

function handleUploadTemplate(event) {
  const files = event?.target?.files;
  if (files && files.length > 0 && activeTemplateId.value) {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    formData.append('data', JSON.stringify({
      templateId: activeTemplateId.value
    }));
    uploadTemplateLoading.value = true;
    return uploadTemplate(formData)
        .then(() => {
          vuexStore.commit('alert/SUCCESS', 'Шаблон успешно загружен');
          updateObjectTypesTable();
        })
        .catch(() => {
          vuexStore.commit('alert/ERROR', 'Ошибка загрузки шаблона');
        })
        .finally(() => {
          uploadTemplateLoading.value = false;
          templateFile.value = null;
        });
  }
}

function handleChangeTemplate(id) {
  //  TODO: завершить логику
}

function handleRemoveOneTemplate(id) {
  templatesLoading.value = true;
  return removeOneTemplate(id)
      .then(() => {
        vuexStore.commit('alert/SUCCESS', 'Шаблон успешно удален');
        updateTemplatesTable();
      })
      .catch(() => {
        vuexStore.commit('alert/ERROR', 'Ошибка удаления');
      })
      .finally(() => {
        templatesLoading.value = false;
      });
}

function handleRemoveManyTemplates() {
  templatesLoading.value = true;
  return removeManyTemplates(templatesSelected.value)
      .then(() => {
        vuexStore.commit('alert/SUCCESS', 'Шаблоны успешно удалены');
        updateTemplatesTable();
      })
      .catch(() => {
        vuexStore.commit('alert/ERROR', 'Ошибка удаления');
      })
      .finally(() => {
        templatesLoading.value = false;
      });
}

function handleRemoveOneObjectType(id) {
  objectTypesLoading.value = true;
  return removeOneObjectType(id)
      .then(() => {
        vuexStore.commit('alert/SUCCESS', 'Тип объекта успешно удален');
        updateTemplatesTable();
      })
      .catch(() => {
        vuexStore.commit('alert/ERROR', 'Ошибка удаления');
      })
      .finally(() => {
        objectTypesLoading.value = false;
      });
}

function handleRemoveManyObjectType() {
  objectTypesLoading.value = true;
  return removeManyObjectTypes(objectTypesSelected.value)
      .then(() => {
        vuexStore.commit('alert/SUCCESS', 'Типы объекта успешно удалены');
        updateTemplatesTable();
      })
      .catch(() => {
        vuexStore.commit('alert/ERROR', 'Ошибка удаления');
      })
      .finally(() => {
        objectTypesLoading.value = false;
      });
}

function handleRemoveOneAngle(id) {
  anglesLoading.value = true;
  return removeOneAngle(id)
      .then(() => {
        vuexStore.commit('alert/SUCCESS', 'Ракурс успешно удален');
        updateTemplatesTable();
      })
      .catch(() => {
        vuexStore.commit('alert/ERROR', 'Ошибка удаления');
      })
      .finally(() => {
        anglesLoading.value = false;
      });
}

function handleRemoveManyAngle() {
  anglesLoading.value = true;
  return removeManyAngles(anglesSelected.value)
      .then(() => {
        vuexStore.commit('alert/SUCCESS', 'Ракурсы успешно удалены');
        updateTemplatesTable();
      })
      .catch(() => {
        vuexStore.commit('alert/ERROR', 'Ошибка удаления');
      })
      .finally(() => {
        anglesLoading.value = false;
      });
}

async function openObjectTypesMenu(templateId) {
  activeTemplateId.value = templateId;
  await updateObjectTypesTable();
  objectTypesMenuIsOpen.value = true;
}

async function openAnglesMenu(objectTypeId) {
  await updateAnglesTable(objectTypeId);
  anglesMenuIsOpen.value = true;
}
</script>