<template>
  <v-container class="d-flex justify-center" style="height:100%;">
    <v-row class="d-flex justify-center align-center">
      <v-col sm="12" md="6" lg="4">
        <v-card>
          <v-card-title>SignUp</v-card-title>
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
                  name="name"
                  rules="required|min:3"
                  tag="div"
                  vid="name"
                >
                  <label class="subtitle-2" for="name">First name</label>
                  <v-text-field
                    id="First_name"
                    v-model="name"
                    :error-messages="errors"
                    label="First name"
                    name="name"
                    outlined
                    required
                  ></v-text-field>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="surname"
                  rules="required|min:3"
                  tag="div"
                  vid="surname"
                >
                  <label class="subtitle-2" for="surname">Last name</label>
                  <v-text-field
                    id="surname"
                    v-model="surname"
                    :error-messages="errors"
                    label="Last name"
                    name="surname"
                    outlined
                    required
                  ></v-text-field>
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="hashed_password"
                  rules="required|min:8|password:@password_confirmation"
                  tag="div"
                  vid="hashed_password"
                >
                  <v-text-field
                    v-model="hashed_password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :error-messages="errors"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    name="hashed_password"
                    outlined
                    @click:append="showPassword = !showPassword"
                  />
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="password confirmation"
                  rules="required|min:8"
                  tag="div"
                  vid="password_confirmation"
                >
                  <v-text-field
                    v-model="password_confirmation"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :error-messages="errors"
                    label="Password confirmation"
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
                >Sign Up
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
      title: 'Sign Up'
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
          content: 'Check Your email for activation link !',
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
