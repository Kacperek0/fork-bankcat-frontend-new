<template>
  <v-overlay :value="loading">

    <v-row
      class="fill-height"
      align-content="center"
      justify="center"
    >
      <v-col
        class="text-subtitle-1 text-center"
        cols="12"
      >
        Activation ...
      </v-col>
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-overlay>
</template>
<script>
import RequestMixin from '~/mixins/RequestMixin'

export default {
  auth: 'guest',
  data() {
    return {
      loading: true
    }
  },
  mixins: [RequestMixin],
  computed: {
    token() {
      return this.$route.params.token
    },
    email() {
      return this.$route.params.email
    }
  },
  methods: {
    async activate() {
      this.loading = true

      try {
        await this.$axios.post('/api/users/verify', {
          token: this.token,
          email: this.email
        })

        this.$notifier.showMessage({
          content: 'Account activated ! You can sign in now!',
          color: 'green',
          timeout: 5000
        })
      } catch (err) {
        this.$notifier.showMessage({
          content: 'Activation failed, check link!',
          color: 'red',
          timeout: 5000
        })
      } finally {
        this.loading = false

        await this.$router.push({
          name: 'index'
        })
      }
    }
  },
  async mounted() {
    await this.activate()
  }
}
</script>
