<template>
  <v-layout full-height style="min-height: 100vh">
    <v-app-bar elevation="0">
      <v-card
          class="bg-blue-darken-2"
          variant="text"
          elevation="1"
          :rounded="0"
          style="min-width: 100%;"
      >
        <v-card-item>
          <div class="d-flex justify-start align-center ga-4">
            <v-list-item
                prepend-icon="mdi-account-cog-outline"
                variant="tonal"
                slim
                nav
                :title="profile.fullName"
                :subtitle="profile.email"
                @click="navigateToProfile"
            >
              <v-tooltip activator="parent" location="bottom">
                Настройки профиля
              </v-tooltip>
            </v-list-item>

            <v-list-item
                prepend-icon="mdi-bell"
                title="Оповещения"
                variant="text"
                slim
                nav
                disabled
                @click=""
            >
              <v-tooltip activator="parent" location="bottom">
                Проверить оповещения
              </v-tooltip>
            </v-list-item>

            <v-list-item
                prepend-icon="mdi-finance"
                title="Статистика"
                slim
                nav
                disabled
                @click=""
            >
              <v-tooltip activator="parent" location="bottom">
                Просмотр статистики
              </v-tooltip>
            </v-list-item>

            <v-spacer/>

            <v-label class="text-caption">
              Текущий баланс аккаунта 1 000 объектов
            </v-label>

            <v-list-item
                prepend-icon=""
                density="compact"
                title="Пополнить баланс"
                border="sm"
                rounded
                slim
                disabled
                nav
                @click=""
            >
            </v-list-item>

          </div>
        </v-card-item>
      </v-card>
    </v-app-bar>

    <v-navigation-drawer
        permanent
        :rail="rail"
        @click="rail = false"
        elevation="0"
        width="210"
        class="bg-grey-lighten-5"
    >
      <v-list variant="text" density="default" nav rounded="lg">
        <v-list-item
            prepend-avatar="/assets/images/logotype.png"
            subtitle="System"
            title="GK Breeze"
            rounded="lg"
        >
          <template #append>
            <v-btn
                icon="mdi-menu-open"
                density="comfortable"
                variant="text"
                rounded="lg"
                :class="rail ? 'd-none' : ''"
                @click.stop="changeRail(!rail)"
            >
              <v-icon/>
              <v-tooltip activator="parent">Скрыть меню</v-tooltip>
            </v-btn>
          </template>
        </v-list-item>

        <v-divider class="mb-3 mt-1"/>

        <v-list-item
            v-for="item of navItems"
            :key="item._id"
            :to="item.route"
            :active="item._id === activeItem"
            :value="item.value"
            :title="item.title"
            :class="item.classes"
            color="blue-accent-4"
            density="compact"
            rounded
            @click="activeItem = item._id"
        >
          <template #prepend>
            <v-icon :icon="item.prependIcon" size="small"/>
          </template>
        </v-list-item>
      </v-list>

      <template #append>
        <v-list variant="text" density="compact" rounded="lg" nav>
          <v-list-item
              prepend-icon="mdi-logout"
              class="bg-white"
              title="Выход"
              border="sm"
              @click="logout"
          >
            <v-tooltip activator="parent">Выйти из системы</v-tooltip>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main>
      <slot/>
    </v-main>

  </v-layout>
</template>

<script>
import {navItems} from '../configs/./navigate-items';
import {getProfile} from "../utils/api/api_profile";
import {navigateTo, reloadNuxtApp} from "nuxt/app";

export default {

  name: "navMenu",

  data() {
    return {
      drawer: true,
      rail: false,
      activeItem: null,
      profile: {},
      navItems,
    }
  },

  beforeMount() {
    this.rail = sessionStorage.navBarRail === 'true';
    this.getProfile();
  },

  mounted() {
    this.activeItem = this.whichRouteIsActive() || null;
  },

  watch: {
    rail(_new) {
      sessionStorage.navBarRail = _new;
    }
  },

  methods: {
    changeRail(value) {
      this.rail = value;
    },

    whichRouteIsActive() {
      return this.navItems?.find(item => this.$route.fullPath.indexOf(item.route) !== -1)?._id;
    },

    navigateToProfile() {
      navigateTo('/manager/profile');
    },

    async getProfile() {
      const response = await getProfile();
      this.profile = response.data;
    },

    logout() {
      localStorage.removeItem('accessToken');
      reloadNuxtApp();
    }
  }

}
</script>