<template>
  <v-container class="d-flex justify-center" style="height:100%;">
    <v-row class="d-flex justify-center align-center">
      <v-col sm="12" md="6" lg="4">
        <v-card>
          <v-card-title>{{ $t('sign_in') }}</v-card-title>
          <v-card-text>

            <validation-observer
              ref="observer"
              v-slot="{ handleSubmit }"
            >
              <v-form ref="form" :disabled="isLoading" @submit.prevent="handleSubmit(submit)">
                <validation-provider
                  v-slot="{ errors }"
                  name="email"
                  rules="required"
                  tag="div"
                  vid="email"
                >
                  <label class="subtitle-2" for="Email">Email</label>
                  <v-text-field
                    id="email"
                    v-model="username"
                    :error-messages="errors"
                    label="email"
                    name="email"
                    outlined
                    required
                  ></v-text-field>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('password')"
                  rules="required|min:4"
                  tag="div"
                  vid="password"
                >
                  <label class="subtitle-2" for="Password">{{ $t('password') }}</label>
                  <v-text-field
                    id="Password"
                    v-model="password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :error-messages="errors"
                    :label="$t('password')"
                    placeholder="Password"
                    :type="showPassword ? 'text' : 'password'"
                    name="password"
                    outlined
                    required
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </validation-provider>

                <v-btn
                  :loading="isLoading"
                  block
                  class="mt-2"
                  color="primary"
                  large
                  type="submit"
                  width="100%"
                >{{ $t('sign_in_action') }}
                </v-btn>
              </v-form>
            </validation-observer>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import RequestMixin from '~/mixins/RequestMixin'

export default {
  auth: 'guest',
  mixins: [RequestMixin],
  data() {
    return {
      username: null,
      password: null,
      isLoading: false,
      showPassword: false
    }
  },
  head() {
    return {
      title:  this.$t('sign_in')
    }
  },
  methods: {
    async submit() {
      this.isLoading = true
      try {
        const formData = new FormData();
        formData.append('username', this.username)
        formData.append('password', this.password)

        await this.$auth.loginWith('local', {
          data: formData
        })

        this.isLoading = false
        await this.$router.push({ name: 'dashboard' })
      } catch (err) {
        this.isLoading = false

        this.dealWithFailedRequest(err)

        this.$refs.observer.setErrors({
          email: this.$t('login_incorrect')
        })
      }
    }
  }
}
</script>
