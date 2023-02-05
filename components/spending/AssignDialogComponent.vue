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
            <span class="headline">{{ $t('assign_to_category') }}</span>
          </v-card-title>
          <v-card-text>

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
                :label="$t('category')"
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
            >{{ $t('cancel') }}
            </v-btn>
            <v-btn
              :disabled="isLoading"
              :loading="isLoading"
              class="body-2 "
              color="primary"
              type="submit"
            >
              {{ $t('set') }}
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-form>
    </validation-observer>

  </v-dialog>
</template>
<script>
import RequestMixin from '~/mixins/RequestMixin'

export default {
  mixins: [RequestMixin],
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    selected: {
      required: true,
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isLoading: false,
      show: this.dialog,
      categories: [],
      form: {
        category_id: null
      }
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
        category_id: this.form.category_id,
        financial_record_ids: this.selected.map((s) => s.id)
      }
    },
    async handle() {
      try {
        this.isLoading = true
        await this.$axios.post('/api/financial-record/mass-category-assigment', this.getForm())

        this.$notifier.showMessage({
          content: this.$t('assigned'),
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
