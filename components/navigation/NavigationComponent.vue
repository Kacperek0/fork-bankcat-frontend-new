<template>
  <v-app-bar app>
    <v-toolbar-title class="mr-4">
      <div class="d-flex align-center">
        <router-link :to="{ name: 'dashboard' }">
          <v-img class="mr-2" style="width:50px;height: 51px;" :src="require('~/assets/logo.png')" />
        </router-link>
        <div>
          <div>Bankcat</div>
          <div class="caption pink--text">Easy savings</div>
        </div>
      </div>
    </v-toolbar-title>

    <template v-if="$auth.loggedIn">
      <v-toolbar-items>
        <v-btn :to="{ name: 'dashboard' }" plain active-class="pink--text">
          <v-icon dark class="mr-2">mdi-monitor-dashboard</v-icon>
          Dashboard
        </v-btn>
        <v-btn :to="{ name: 'import' }" plain active-class="pink--text">
          <v-icon dark class="mr-2">mdi-table-arrow-left</v-icon>
          Import data
        </v-btn>
        <v-btn :to="{ name: 'categories' }" plain active-class="pink--text">
          <v-icon dark class="mr-2">mdi-shape</v-icon>
          Categories
        </v-btn>
        <v-btn :to="{ name: 'budget' }" plain active-class="pink--text">
          <v-icon dark class="mr-2">mdi-cash-marker</v-icon>
          Budget
        </v-btn>
        <v-btn :to="{ name: 'spendings' }" plain active-class="pink--text">
          <v-icon dark class="mr-2">mdi-cash</v-icon>
          Spendings
        </v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <DatePickerComponent />

      <v-spacer></v-spacer>

      <div class="d-flex align-center pa-4">
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

  </v-app-bar>
</template>
<script>
import DatePickerComponent from '~/components/navigation/DatePickerComponent'

export default {
  components: {
    DatePickerComponent
  }
}
</script>
