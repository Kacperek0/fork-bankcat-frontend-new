<template>
  <div>
    <v-app-bar app>
      <v-app-bar-nav-icon class="d-lg-none" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <div class="d-flex mr-1">
        <div class="d-flex align-center">
          <router-link :to="{ name: 'index' }">
            <v-img class="mr-2" :src="require('~/assets/logo.png')" />
          </router-link>
          <div class="d-none d-lg-block">
            <div>Bankcat</div>
            <div class="caption pink--text">{{ $t('slogan') }}</div>
          </div>
        </div>
      </div>

      <template v-if="$auth.loggedIn">
        <v-toolbar-items class="d-none d-lg-flex">
          <v-btn
            v-for="m in menu"
            :key="`menu-${m.title}`"
            :to="getRoute(m)"
            plain
            active-class="pink--text"
            @click.prevent="goTo(m)"
          >
            <v-icon dark class="mr-2">{{ m.icon }}</v-icon>
            {{ $t(`menu.${m.link}`) }}
          </v-btn>
        </v-toolbar-items>

        <v-spacer></v-spacer>

        <DatePickerComponent />

        <v-spacer></v-spacer>

        <div class="align-center pa-4 d-none d-lg-flex">
          <v-icon class="mr-1" dark>
            mdi-account
          </v-icon>
          <div class="subtitle-2">
            {{ $auth.user.name }} {{ $auth.user.surname }}
          </div>
          <v-btn small icon class="ml-3" color="pink" @click.prevent="$auth.logout()">
            <v-icon dark>mdi-logout</v-icon>
          </v-btn>
        </div>
      </template>
      <v-spacer></v-spacer>

      <ToolbarLanguage />

    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      temporary
      fixed
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <template v-if="$auth.loggedIn">
            <v-list-item-title class="my-4">
              <div class="grey--text subline">Menu:</div>
            </v-list-item-title>

            <v-list-item
              v-for="m in menu"
              :key="`menu-mobile-${m.title}`"
            >
              <v-list-item-title>
                <v-btn
                  :to="getRoute(m)"
                  plain
                  active-class="pink--text"
                  @click.prevent="goTo(m)"
                >
                  <v-icon dark class="mr-2">{{ m.icon }}</v-icon>
                  {{ $t(`menu.${m.link}`) }}
                </v-btn>
              </v-list-item-title>
            </v-list-item>

            <v-divider class="my-2"></v-divider>
          </template>

          <v-list-item-title class="my-4">
            <div class="grey--text subline">User:</div>
          </v-list-item-title>

          <template v-if="$auth.loggedIn">
            <v-list-item-title class="caption my-2 pl-5 d-flex align-center font-italic">
              <v-icon class="mr-1" dark>
                mdi-account
              </v-icon>
              {{ $auth.user.name }} {{ $auth.user.surname }}
            </v-list-item-title>
            <v-list-item>
              <v-btn small text plain class="subline" @click.prevent="$auth.logout()">
                <v-icon dark>mdi-logout</v-icon>
                Wyloguj
              </v-btn>
            </v-list-item>
          </template>
          <template v-else>

            <v-list-item>
              <v-list-item-title>
                <v-btn
                  :to="{ name: 'auth-login' }"
                  plain
                  active-class="pink--text"
                >
                  <v-icon dark class="mr-2">mdi-account-circle</v-icon>
                  Login
                </v-btn>
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>
                <v-btn
                  :to="{ name: 'auth-register' }"
                  plain
                  active-class="pink--text"
                >
                  <v-icon dark class="mr-2">mdi-account-plus</v-icon>
                  Register
                </v-btn>
              </v-list-item-title>
            </v-list-item>

          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
import DatePickerComponent from '~/components/navigation/DatePickerComponent'
import ToolbarLanguage from '~/components/toolbars/ToolbarLanguage'

export default {
  components: {
    DatePickerComponent,
    ToolbarLanguage
  },
  data() {
    return {
      menu: [
        {
          title: 'Dashboard',
          icon: 'mdi-monitor-dashboard',
          link: 'dashboard'
        },
        {
          title: 'Import data',
          icon: 'mdi-table-arrow-left',
          link: 'import'
        },
        {
          title: 'Categories',
          icon: 'mdi-shape',
          link: 'categories'
        },
        {
          title: 'Budget',
          icon: 'mdi-cash-marker',
          link: 'budget'
        },
        {
          title: 'Spendings',
          icon: 'mdi-cash',
          link: 'spendings'
        }
      ],
      drawer: false,
      group: null
    }
  },
  methods: {
    goTo(route) {
      this.$router.push(this.getRoute(route))
    },
    getRoute(route) {
      return {
        name: route.link,
        query: this.$route.query
      }
    }
  }
}
</script>
