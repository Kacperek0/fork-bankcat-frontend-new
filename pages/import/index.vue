<template>
  <v-container class="d-flex justify-center">
    <v-row class="d-flex justify-center align-center">
      <v-col md="12" lg="10">
        <v-card>
          <validation-observer
            ref="observer"
            v-slot="{ handleSubmit }"
            slim
          >
            <v-form ref="form" :disabled="isLoading" @submit.prevent="handleSubmit(handle)">
              <v-card-title class="d-flex">
                {{ $t('import_bank_data') }}
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col sm="12" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      :name="$t('choose_your_bank')"
                      class="d-flex"
                      rules="required"
                      tag="div"
                      vid="bank"
                    >
                      <v-select
                        v-model="form.bank"
                        :items="banks"
                        :label="$t('choose_your_bank')"
                        item-text="name"
                        :error-messages="errors"
                        item-value="url"
                        clearable
                        @change="clearFile"
                      ></v-select>
                    </validation-provider>

                    <validation-provider
                      v-slot="{ errors }"
                      :name="$t('file')"
                      class="d-flex"
                      rules="required"
                      tag="div"
                      vid="file"
                    >
                      <v-file-input
                        v-model="form.file"
                        :accept="fileAccept"
                        :error-messages="errors"
                        :label="$t('file')"
                        required
                      ></v-file-input>
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-card-text>


              <v-card-actions>
                <v-btn
                  :disabled="isLoading"
                  :loading="isLoading"
                  class="body-2 "
                  color="primary"
                  type="submit"
                >
                  {{ $t('import') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import RequestMixin from '~/mixins/RequestMixin'

export default {
  mixins: [RequestMixin],
  data() {
    return {
      isLoading: false,
      form: {
        bank: null,
        file: null
      },
      banks: [
        {
          name: 'mBank',
          url: 'mbank/import_csv',
          accept: '.csv'
        },
        {
          name: 'PKO BP',
          url: 'pkobp/import_pdf',
          accept: '.pdf'
        },
        {
          name: 'Santander',
          url: 'santander/import_csv',
          accept: '.csv'
        },
        {
          name: 'Pekao SA',
          url: 'pekaosa/import_csv',
          accept: '.csv'
        },
        {
          name: 'Grupa PBS',
          url: 'grupabps/import_csv',
          accept: '.csv'
        },
        {
          name: 'Millenium',
          url: 'millenium/import_pdf',
          accept: '.pdf'
        }
      ]
    }
  },
  head() {
    return {
      title: this.$t('menu.import')
    }
  },
  computed: {
    fileAccept() {
      if (!this.form.bank) {
        return null
      }

      const bank = this.banks.find((b) => b.url === this.form.bank)
      return bank ? (bank.accept || null) : null
    }
  },
  methods: {
    clearFile() {
      this.form.file = null
    },
    async handle() {
      try {
        this.isLoading = true

        const formData = new FormData()
        formData.append('file', this.form.file)

        await this.$axios.post(`/api/${this.form.bank}`, formData)

        await this.$router.push({ name: 'spendings' })
      } catch (err) {
        this.dealWithFailedRequest(err)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
