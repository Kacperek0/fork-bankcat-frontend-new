<template>
  <v-container class='d-flex justify-center' style='height:100%;'>
    <v-row class='d-flex justify-center align-center'>
      <v-col sm='12' md='6' lg='4'>
        <v-card>
          <v-card-title>Welcome</v-card-title>
          <v-card-text class='d-flex justify-center'>
            <v-btn class='ma-1' :to="{ name: 'auth-login' }" color='primary'>SignIn</v-btn>
            <v-btn class='ma-1' :to="{ name: 'auth-register' }" color='secondary'>SingUp</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'IndexPage',
  auth: false,
  head() {
    return {
      title: 'Bankcat'
    }
  },
  async beforeMount() {
    if (this.$auth.loggedIn) {
      await this.$router.push({ name: 'dashboard' })
    }
  }
}
</script>
