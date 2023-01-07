<template>
  <v-app dark>
    <NavigationComponent />
    <v-main>

      <v-container fluid>
        <router-view></router-view>
      </v-container>

      <SnackbarComponent />
    </v-main>
  </v-app>
</template>

<script>
import SnackbarComponent from '~/components/SnackbarComponent'
import NavigationComponent from '~/components/navigation/NavigationComponent'

export default {
  name: 'DefaultLayout',
  components: {
    SnackbarComponent,
    NavigationComponent
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>
