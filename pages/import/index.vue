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
                Import bank data
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="bank"
                      class="d-flex"
                      rules="required"
                      tag="div"
                      vid="bank"
                    >
                      <v-select
                        v-model="form.bank"
                        :items="banks"
                        label="Bank"
                        item-text="name"
                        :error-messages="errors"
                        item-value="url"
                        clearable
                        @change="clearFile"
                      ></v-select>
                    </validation-provider>

                    <validation-provider
                      v-slot="{ errors }"
                      name="file"
                      class="d-flex"
                      rules="required"
                      tag="div"
                      vid="file"
                    >
                      <v-file-input
                        v-model="form.file"
                        :accept="fileAccept"
                        :error-messages="errors"
                        label="File"
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
                  Upload
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
          url: 'grupapbs/import_csv',
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
      } catch (err) {
        this.dealWithFailedRequest(err)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
