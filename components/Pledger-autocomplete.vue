<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        :items="pledgerList"
        :loading="fetching"
        :custom-filter="pledgersSearchFilter"
        @update:menu="onUpdateMenuPledgers"
        prepend-inner-icon="mdi-file-document-edit"
        no-data-text="нет данных"
        color="yellow-darken-4"
        variant="outlined"
        density="compact"
        label="Залогодатель"
        closable-chips
        hide-selected
        chips
        v-bind="$attrs"
    >
      <template #chip="{ props, item }">
        <v-chip
            v-bind="props"
            :text="`${item.raw?.firstName || ''} ${item.raw?.surname || ''} ${item.raw?.lastName || ''}`"
            prepend-icon="mdi-file-document-edit"
            color="blue-grey-darken-3"
            density="comfortable"
            label
        />
      </template>
      <template #item="{ props, item }">
        <v-list-item
            v-bind="props"
            prepend-icon="mdi-file-document-edit"
            :title="`${item.raw?.firstName || ''} ${item.raw?.surname || ''} ${item.raw?.lastName || ''}`"
            :subtitle="`${item.raw?.inn || 'ИНН отсутствует'}`"
        >
          <template #append>
            <v-btn
                icon="mdi-progress-close"
                color="red-darken-4"
                density="comfortable"
                variant="text"
                @click.stop="removePledger(item.raw._id)"
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
        class="border-sm border-dashed"
        variant="outlined"
        icon="mdi-plus"
        rounded="lg"
        size="small"
        @click="pledgerFormAddVisible = true"
    >
      <v-icon/>
      <v-tooltip activator="parent" location="left">
        Добавить нового залогодателя
      </v-tooltip>
    </v-btn>

    <v-overlay v-model="pledgerFormAddVisible" class="d-flex align-center justify-center">
      <my-form-pledger-add @add:success="onPledgerAddSuccess" @click:close="pledgerFormAddVisible=false"/>
    </v-overlay>
  </div>
</template>

<script>
import {fetchPledgers, removePledger} from "../utils/api/api_pledgers.js";

export default {
  name: "pledgers",

  data() {
    return {
      pledgerList: [],
      fetching: false,
      pledgerFormAddVisible: false,
      pledgerRules: [v => v || 'Выберите залогодателя'],
    }
  },

  methods: {

    onPledgerAddSuccess() {
      this.fetchPledgerList();
      this.pledgerFormAddVisible = false;
    },

    onUpdateMenuPledgers(status) {
      if (status) this.fetchPledgerList();
    },

    removePledger(pledgerID) {
      removePledger(pledgerID)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Залогодатель успешно удален');
            this.fetchPledgerList();
          })
          .catch(err => {
            if (err.response && err.response.status === 400) {
              this.$store.commit('alert/ERROR', 'Недостаточно прав для удаления залогодателя');
            } else {
              this.$store.commit('alert/ERROR', 'Не удалось удалить залогодателя');
            }
            console.log('Ошибка удаления залогодателя', err);
          })
    },

    pledgersSearchFilter(value, query, item) {
      return [
        item.raw.inn || null,
        item.raw.firstName || null,
        item.raw.surname || null,
        item.raw.lastName || null,
        item.raw.position || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },

    async fetchPledgerList() {

      this.fetching = true;

      fetchPledgers()
          .then(response => {
            this.pledgerList = response.data;
          })
          .catch(err => {
            this.$store.commit('alert/ERROR', 'Ошибка получения списка залогодателей');
            console.log('Ошибка получения списка залогодателей', err);
          })
          .finally(() => {
            this.fetching = false;
          })
    },

  }
}
</script>