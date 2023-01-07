<template>
  <v-dialog
    v-model="show"
    max-width="800px"
    persistent
    scrollable
  >
    <validation-observer
      ref="observer"
      v-slot="{ handleSubmit }"
      slim
    >
      <v-form ref="form" :disabled="isLoading" @submit.prevent="handleSubmit(handle)">
        <v-card>
          <v-card-title>
            <span class="headline">{{ isUpdate ? 'Update' : 'Create' }}</span>
          </v-card-title>
          <v-card-text>

            <v-menu
              v-model="modal.show"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <validation-provider
                  v-slot="{ errors }"
                  name="date"
                  class="d-flex"
                  rules="required"
                  tag="div"
                  vid="date"
                >
                  <v-text-field
                    v-model="form.date"
                    :error-messages="errors"
                    label="Spending date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </validation-provider>
              </template>
              <v-date-picker
                v-model="form.date"
                @input="modal.show = false"
              ></v-date-picker>
            </v-menu>

            <validation-provider
              v-slot="{ errors }"
              name="description"
              class="d-flex"
              rules="required"
              tag="div"
              vid="description"
            >
              <v-text-field
                v-model="form.description"
                :error-messages="errors"
                label="Description"
                required
              ></v-text-field>
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              name="amount"
              class="d-flex"
              rules="required|min_value:1"
              tag="div"
              vid="amount"
            >
              <v-text-field
                v-model="form.amount"
                :error-messages="errors"
                label="Amount"
                type="number"
                required
                suffix="PLN"
              ></v-text-field>
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              name="category"
              class="d-flex"
              rules="required"
              tag="div"
              vid="category"
            >
              <v-select
                v-model="form.category_id"
                :items="categories"
                label="Category"
                item-text="name"
                item-value="id"
                :error-messages="errors"
                clearable
              ></v-select>
            </validation-provider>

          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="body-2"
              color="grey"
              text
              @click.native="close"
            >Cancel
            </v-btn>
            <v-btn
              :disabled="isLoading"
              :loading="isLoading"
              class="body-2 "
              color="primary"
              type="submit"
            >
              {{ isUpdate ? 'Update' : 'Create' }}
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-form>
    </validation-observer>

  </v-dialog>
</template>
<script>
import moment from 'moment'
import RequestMixin from '~/mixins/RequestMixin'

export default {
  mixins: [RequestMixin],
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    model: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isLoading: false,
      show: this.dialog,
      categories: [],
      modal: {
        show: false
      },
      form: {
        description: null,
        date: moment().format('YYYY-MM-DD'),
        amount: 0,
        category_id: null
      }
    }
  },
  computed: {
    isUpdate() {
      return !!this.model
    },
    multipledAmount() {
      return Number(this.form.amount) * 100
    }
  },
  watch: {
    async show(show) {
      if (show) {
        await this.fetchCategories()
      }
    },
    dialog(dialog) {
      this.show = dialog
    },
    model: {
      handler() {
        this.reset()
      },
      deep: true
    }
  },
  methods: {
    async fetchCategories() {
      this.isLoading = true

      try {
        const skip = 0
        const limit = 1000

        const response = await this.$axios.get('/api/categories', {
          params: {
            skip,
            limit
          }
        })

        this.categories = response.data
      } catch (e) {
      } finally {
        this.isLoading = false
      }
    },
    getForm() {
      return {
        description: this.form.description,
        amount: this.multipledAmount,
        category_id: this.form.category_id,
        date: this.form.date
      }
    },
    async create() {
      return await this.$axios.post('/api/financial-record', this.getForm())
    },
    async update() {
      return await this.$axios.put(`/api/financial-record/${this.model.id}`, this.getForm())
    },
    async handle() {
      try {
        this.isLoading = true
        await this[this.isUpdate ? 'update' : 'create']()

        this.$notifier.showMessage({
          content: this.isUpdate ? 'Spending saved' : 'Spending created',
          color: 'green'
        })

        this.close()
        this.$emit('refresh')
      } catch (err) {
        this.dealWithFailedRequest(err)
      } finally {
        this.isLoading = false
      }
    },
    reset() {
      this.form = {
        description: null,
        date: moment().format('YYYY-MM-DD'),
        amount: 0,
        category_id: null
      }
      if (this.$refs.observer) {
        this.$refs.observer.reset()
      }
    },
    close() {
      this.reset()
      this.$emit('update:dialog', false)
    }
  }
}
</script>
