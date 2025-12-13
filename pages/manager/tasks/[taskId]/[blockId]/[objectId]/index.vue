<template>
  <v-container fluid>

    <v-card variant="text">
      <v-card-item>
        <v-btn v-bind="navigateBackBtnStyle" @click="$router.back">
          Назад
          <v-tooltip activator="parent" location="left">
            Вернуться назад
          </v-tooltip>
        </v-btn>
      </v-card-item>
    </v-card>

    <v-card variant="text">

      <v-card-title>{{ objectNameTitle }}</v-card-title>

      <v-card-subtitle>
        {{ inspectionObject?.address || 'Адрес отсутствует' }}
      </v-card-subtitle>

      <v-card-item>
        <div class="text-caption border-dashed border-sm px-1 rounded">
          {{ inspectionObject?.description || 'Описание отсутствует' }}
        </div>
      </v-card-item>

      <v-file-input
          v-model="files"
          class="d-none"
          variant="outlined"
          density="compact"
          capture="camera"
          accept=".jpg, .png, .jpeg"
          id="inputfile"
          type="file"
          @change="sendImages"
      />

      <v-card-item>
        <v-sheet max-height="700px"
                 class="d-flex flex-column ga-6 overflow-y-scroll overflow-x-hidden pb-6">
          <div v-for="angle of angles" class="d-flex flex-column ga-2">

            <div class="font-bold d-flex align-center">
              <v-chip label color="blue-darken-4" density="comfortable">
                {{ angle.name }}
              </v-chip>
            </div>

            <v-sheet class="d-flex flex-wrap ga-2">
              <div v-for="photo of angle.photoList">
                <v-img
                    :src="photo['150x150']"
                    :lazy-src="photo['150x150']"
                    style="min-width: 120px; max-width: 120px; height: 100px"
                    class="rounded cursor-pointer border-sm border-dashed"
                    @click="showLightbox(photo._id)"
                />
              </div>
            </v-sheet>
          </div>
        </v-sheet>
      </v-card-item>

      <my-overlay v-model="objectMenuChangeVisibility">
        <object-change
            @change:success="onObjectChangeSuccess"
            @click:close="objectMenuChangeVisibility=false"
        />
      </my-overlay>
    </v-card>

    <my-overlay v-model="questionIsVisible">
      <v-sheet class="bg-white rounded px-6 py-4">
        <span class="ml-2">Хотите удалить фото?</span>
        <v-divider class="my-2" />
        <v-btn density="comfortable" size="small" @click.stop="removeImg" variant="elevated" text="Да"/>
        <v-btn density="comfortable" size="small" @click.stop="questionIsVisible=false" text="Нет" class="ml-4"/>
      </v-sheet>
    </my-overlay>

    <VueEasyLightbox
        :visible="lightboxVisible"
        :index="initPhotoIndex"
        :imgs="lightboxImages"
        @hide="hideLightbox"
        @on-index-change="onChangeLightboxIndex"
    >
      <template #toolbar="{ toolbarMethods }">
        <div class="position-absolute left-0 right-0 bottom-0 d-flex justify-center ga-1 mb-2">
          <v-btn-group density="default" variant="flat">
            <v-btn @click="toolbarMethods.zoomIn" icon="mdi-magnify-plus-outline">
              <v-icon icon="mdi-magnify-plus-outline"/>
              <v-tooltip activator="parent" location="top start">
                Увеличить
              </v-tooltip>
            </v-btn>
            <v-btn @click="toolbarMethods.zoomOut" icon="mdi-magnify-minus-outline">
              <v-icon icon="mdi-magnify-minus-outline"/>
              <v-tooltip activator="parent" location="top start">
                Уменьшить
              </v-tooltip>
            </v-btn>
            <v-btn @click="questionIsVisible = true" icon="mdi-close-box-multiple-outline">
              <v-icon icon="mdi-close-box-multiple-outline"/>
              <v-tooltip activator="parent" location="top start">
                Удалить
              </v-tooltip>
            </v-btn>
          </v-btn-group>
        </div>
      </template>
    </VueEasyLightbox>
  </v-container>
</template>

<script>
import {removeImg, sendImg} from "@/utils/api/api_images";
import {navigateBackBtnStyle} from "@/configs/styles";
import {fetchAngles} from "@/utils/api/api_angles";
import {navigateTo} from "nuxt/app";
import _ from "lodash";

export default {
  name: "object-page",

  data() {
    return {
      angles: [],
      files: [],
      progress: 0,
      objectMenuChangeVisibility: false,
      questionIsVisible: false,

      // lightbox
      lightboxVisible: false,
      initPhotoIndex: null,
      currentPhotoIndex: null,
      currentPhotoId: null,

      // IMPORT STYLES
      navigateBackBtnStyle,
    }
  },

  beforeMount() {
    fetchAngles(useRoute().params.objectId)
        .then((response) => {
          this.angles = response.data;
        })
        .catch(err => {
          console.log('Такого объекта не существует', err);
          this.$store.commit('alert/ERROR', 'Такого объекта не существует');
          this.navigateBack();
        })
  },

  watch: {
    initPhotoIndex() {
      if (this.initPhotoIndex !== null && this.initPhotoIndex !== undefined) {
        this.currentPhotoIndex = this.initPhotoIndex;
      }
    },
    currentPhotoIndex() {
      if (this.lightboxImages[this.initPhotoIndex]?._id) {
        this.currentPhotoId = this.lightboxImages[this.initPhotoIndex]?._id;
        console.log('\n\n--------------------------------------------------------------');
        console.log('Watcher [currentPhotoIndex]');
        console.log('this.initPhotoIndex:\t', this.initPhotoIndex);
        console.log('this.currentPhotoIndex:\t', this.currentPhotoIndex);
        console.log('this.currentPhotoId:\t', this.currentPhotoId);
        console.log('--------------------------------------------------------------\n');
      }
    }
  },

  computed: {
    lightboxImages() {
      const array = [];
      this.angles.forEach(angle => {
        angle.photoList.forEach(e => {
          array.push({
            _id: e._id,
            src: e.fullSize,
            title: angle.name
          });
        })
      });
      return array;
    },
    inspectionObject() {
      return this.$store.getters['inspectionObjects/GET_SELECTED'];
    },
    objectNameTitle() {
      return (this.inspectionObject?.name || 'Имя отсутствует') + ' / ' + (this.inspectionObject?.inventoryNumber || 'Инв. номер отсутствует');
    },
  },

  methods: {

    onChangeLightboxIndex(oldIndex, newIndex) {

      if (!_.isNil(newIndex) && !_.isNil(this.lightboxImages[newIndex]?._id)) {
        this.initPhotoIndex = newIndex;
      }
      console.log('\n\n--------------------------------------------------------------');
      console.log('Исполнено событие обновления [onChangeLightboxIndex]');
      console.log('--------------------------------------------------------------');
      console.log('Параметры события:');
      console.log('Старый индекс:\t', oldIndex);
      console.log('Новый индекс:\t', newIndex);
      console.log('--------------------------------------------------------------');
      console.log('Состояние Data:');
      console.log('this.initPhotoIndex:\t', this.initPhotoIndex);
      console.log('this.currentPhotoIndex:\t', this.currentPhotoIndex);
      console.log('this.currentPhotoId:\t', this.currentPhotoId);
      console.log('--------------------------------------------------------------\n');
    },

    showLightbox(imgID) {
      this.initPhotoIndex = this.lightboxImages.findIndex(img => img._id === imgID);
      this.lightboxVisible = true;
    },

    hideLightbox() {
      this.lightboxVisible = false;
      this.initPhotoIndex = null;
    },

    navigateBack() {
      const p = useRoute().params;
      navigateTo(`/manager/assignments/${p.assignmentId}/${p.blockId}/`);
    },

    onObjectChangeSuccess() {
      this.objectMenuChangeVisibility = false;
      this.updateObjectsStore();
    },

    updateObjectsStore() {

      // Получаем ID Блока
      const currentObject = this.$store.getters['assignmentBlocks/GET_SELECTED_ITEM'];

      if (currentObject?._id) {
        // Обращаемся к состоянию <inspection Objects> и Загружаем его список
        this.$store.dispatch('inspectionObjects/FETCH', currentObject?._id);
      } else {
        // Отсутствует ID Блока по которому должны получить список объектов
        this.$store.commit('inspectionObjects/ALERT_ERROR', 'Отсутствует ID Блока в Store');
      }
    },

    removeImg() {
      const photoId = this.currentPhotoId;

      console.log('\n\n--------------------------------------------------------------');
      console.log('Информаци о состоянии до удаления');
      console.log('--------------------------------------------------------------');
      console.log('this.initPhotoIndex:\t', this.initPhotoIndex);
      console.log('this.currentPhotoIndex:\t', this.currentPhotoIndex);
      console.log('this.currentPhotoId:\t', this.currentPhotoId);
      console.log('this.lightboxImages.length:\t', this.lightboxImages.length);
      console.log('--------------------------------------------------------------\n');
      console.log('lightboxImages.len - currentPhotoIndex:', (this.lightboxImages.length - 1) - this.currentPhotoIndex)

      if (photoId) {
        removeImg(photoId)
            .then(async () => {

              // Если удаление на сервере успешно -> удаляем из store
              this.angles = this.angles.map(angle => {
                angle.photoList = angle.photoList.filter(e => {
                  return e._id !== photoId;
                })
                return angle;
              })

              // Если фотографий не осталось
              if (this.lightboxImages.length === 0) {
                this.lightboxVisible = false;
                this.initPhotoIndex = null;
                this.currentPhotoIndex = null;
                this.currentPhotoId = null;
              }

              if (this.lightboxImages.length > 0) {

                if (this.currentPhotoIndex >= this.lightboxImages.length) {
                  this.initPhotoIndex -= 1;
                }

                if (this.currentPhotoIndex < this.lightboxImages.length) {
                  this.currentPhotoId = this.lightboxImages[this.currentPhotoIndex]._id;
                }

              }

            })
            .catch(err => {
              console.log('Ошибка удаления фотографии', err);
            })
            .finally(() => {
              this.questionIsVisible = false;

              console.log('\n\n--------------------------------------------------------------');
              console.log('Информаци о состоянии после удаления');
              console.log('--------------------------------------------------------------');
              console.log('this.initPhotoIndex:\t', this.initPhotoIndex);
              console.log('this.currentPhotoIndex:\t', this.currentPhotoIndex);
              console.log('this.currentPhotoId:\t', this.currentPhotoId);
              console.log('this.lightboxImages.length:\t', this.lightboxImages.length);
              console.log('--------------------------------------------------------------\n');
            })
      }
    },

    sendImages() {

      if (!Array.isArray(this.files) || this.files.length === 0) {
        this.$store.commit('inspectionObjects/ALERT_ERROR', 'Ошибка. Файлы не выбраны');
      }

      let step = 100 / this.files.length;

      for (let file of this.files) {

        let formData = new FormData();

        formData.append('image', file);

        sendImg(this.inspectionObject._id, formData)
            .then(() => {
              this.fetchImages();
            })
            .catch(err => {
              console.log('Ошибка отправки фотографии', err);
            })

        this.progress += Math.floor(step);
      }
      this.files = [];
    },
  }
}
</script>