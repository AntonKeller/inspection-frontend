<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        :items="contacts"
        :loading="fetching"
        :custom-filter="contactSearchFilter"
        @update:menu="onUpdateMenuContacts"
        prepend-inner-icon="mdi-file-document-edit"
        no-data-text="нет данных"
        color="yellow-darken-3"
        label="Контактное лицо"
        variant="outlined"
        density="compact"
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
            :subtitle="`${item.raw?.email || ''}`"
        >
          <template #append>
            <v-btn
                icon="mdi-progress-close"
                color="red-darken-4"
                density="comfortable"
                variant="text"
                @click.stop="removeContact(item.raw._id)"
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
        @click="contactFormAddVisible = true"
    >
      <v-icon/>
      <v-tooltip activator="parent" location="left">
        Добавить новое контактное лицо
      </v-tooltip>
    </v-btn>

    <v-overlay v-model="contactFormAddVisible" class="d-flex align-center justify-center">
      <my-form-contact-add @add:success="onContactAddSuccess" @click:close="contactFormAddVisible=false"/>
    </v-overlay>

  </div>
</template>

<script>
import {fetchContacts, removeContact} from "../utils/api/api_contacts.js";

export default {
  name: "contacts",
  inheritAttrs: false,

  data() {
    return {
      contactsList: [],
      fetching: false,
      contactFormAddVisible: false,
      contactRules: [v => v || 'Выберите контактное лицо'],
    }
  },

  beforeMount() {
    console.log('this.$attrs:', this.$attrs);
  },


  computed: {
    contacts() {
      return this.contactsList?.filter(contact => !contact.parent) || [];
    },
  },


  methods: {

    onContactAddSuccess() {
      this.fetchContactsList();
      this.contactFormAddVisible = false;
    },

    onUpdateMenuContacts(status) {
      if (status) this.fetchContactsList();
    },

    contactSearchFilter(value, query, item) {
      console.log('value', value)
      return [
        item.raw?.firstName || null,
        item.raw?.surname || null,
        item.raw?.lastName || null,
        item.raw?.email || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },

    removeContact(id) {
      removeContact(id)
          .then(() => {
            this.fetchContactsList();
          })
          .catch(err => {
            console.log('Не удалось удалить', err);
          })
    },

    async fetchContactsList() {

      this.fetching = true;

      fetchContacts()
          .then(response => {
            this.contactsList = response.data;
          })
          .catch(err => {
            this.$store.commit("alert/ERROR", 'Ошибка получения списка контактов');
            console.log('Ошибка получения списка контактов', err);
          })
          .finally(() => {
            this.fetching = false;
          })
    },
  }
}
</script>