<template>
  <v-container class="d-flex justify-center" style="height:100%;">
    <v-row class="d-flex justify-center align-center">
      <v-col sm="12" md="6" lg="4">
        <v-card>
          <v-card-title>{{ $t('sign_up') }}</v-card-title>
          <v-card-text>

            <validation-observer
              ref="observer"
              v-slot="{ handleSubmit }"
            >
              <v-form ref="form" :disabled="isLoading" @submit.prevent="handleSubmit(submit)">
                <validation-provider
                  v-slot="{ errors }"
                  name="email"
                  rules="required|email"
                  tag="div"
                  vid="email"
                >
                  <label class="subtitle-2" for="Email">Email</label>
                  <v-text-field
                    id="Email"
                    v-model="email"
                    :error-messages="errors"
                    label="email"
                    name="email"
                    outlined
                    required
                  ></v-text-field>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('first_name')"
                  rules="required|min:3"
                  tag="div"
                  vid="name"
                >
                  <label class="subtitle-2" for="name">{{ $t('first_name') }}</label>
                  <v-text-field
                    id="first_name"
                    v-model="name"
                    :error-messages="errors"
                    :label="$t('first_name')"
                    name="name"
                    outlined
                    required
                  ></v-text-field>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('last_name')"
                  rules="required|min:3"
                  tag="div"
                  vid="surname"
                >
                  <label class="subtitle-2" for="surname">{{ $t('last_name') }}</label>
                  <v-text-field
                    id="surname"
                    v-model="surname"
                    :error-messages="errors"
                    :label="$t('last_name')"
                    name="surname"
                    outlined
                    required
                  ></v-text-field>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('password')"
                  rules="required|min:8|password:@password_confirmation"
                  tag="div"
                  vid="hashed_password"
                >
                  <v-text-field
                    v-model="hashed_password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :error-messages="errors"
                    :label="$t('password')"
                    :type="showPassword ? 'text' : 'password'"
                    name="hashed_password"
                    outlined
                    @click:append="showPassword = !showPassword"
                  />
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  :name="$t('password_confirmation')"
                  rules="required|min:8"
                  tag="div"
                  vid="password_confirmation"
                >
                  <v-text-field
                    v-model="password_confirmation"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :error-messages="errors"
                    :label="$t('password_confirmation')"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="new_password"
                    name="password_confirmation"
                    outlined
                    @click:append="showPassword = !showPassword"
                  />
                </validation-provider>

                <v-btn
                  :loading="isLoading"
                  block
                  class="mt-2"
                  color="primary"
                  large
                  type="submit"
                  width="100%"
                >{{ $t('sign_up_action') }}
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
      name: null,
      surname: null,
      email: null,
      hashed_password: null,
      password_confirmation: null,
      isLoading: false,
      showPassword: false
    }
  },
  head() {
    return {
      title: this.$t('sign_up')
    }
  },
  methods: {
    async submit() {
      this.isLoading = true
      try {
        await this.$axios.post('/api/register', {
          name: this.name,
          surname: this.surname,
          email: this.email,
          hashed_password: this.hashed_password
        })

        this.isLoading = false

        this.$notifier.showMessage({
          content: this.$t('register_check_your_email'),
          color: 'green',
          timeout: 10000
        })

        await this.$router.push({ name: 'index' })
      } catch (err) {
        this.isLoading = false
        this.dealWithFailedRequest(err)
      }
    }
  }
}
</script>
