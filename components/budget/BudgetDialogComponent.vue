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
            <span class="headline">{{ isUpdate ? $t('update') : $t('create') }}</span>
          </v-card-title>
          <v-card-text>
            <validation-provider
              v-slot="{ errors }"
              :name="$t('amount')"
              class="d-flex"
              rules="required|min_value:1"
              tag="div"
              vid="value"
            >
              <v-text-field
                v-model="form.value"
                :error-messages="errors"
                :label="$t('amount')"
                type="number"
                required
                suffix="PLN"
              ></v-text-field>
            </validation-provider>

            <v-text-field
              :value="spending | money"
              :label="$t('current_spend_in_category')"
              type="number"
              readonly
              disabled
              suffix="PLN"
            ></v-text-field>

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
              {{ isUpdate ? $t('update') : $t('create') }}
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
    model: {
      type: Object,
      default: null
    },
    category: {
      type: Object,
      default: null
    },
    spending: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isLoading: false,
      show: this.dialog,
      form: {
        value: 0
      }
    }
  },
  computed: {
    isUpdate() {
      return !!this.model
    },
    multipledValue() {
      return Number(this.form.value) * 100
    }
  },
  watch: {
    show() {
      this.hydrate()
    },
    dialog(dialog) {
      this.show = dialog
    },
    model: {
      handler() {
        this.reset()
        this.hydrate()
      },
      deep: true
    }
  },
  methods: {
    async create() {
      return await this.$axios.post('/api/budget', {
        value: this.multipledValue,
        category_id: this.category.id
      })
    },
    async update() {
      return await this.$axios.put(`/api/budget/${this.model.id}`, {
        value: this.multipledValue,
        category_id: this.model.category.id
      })
    },
    hydrate() {
      if (this.isUpdate) {
        this.form = {
          value: this.model.budget / 100
        }
      }
    },
    async handle() {
      try {
        this.isLoading = true
        await this[this.isUpdate ? 'update' : 'create']()

        this.$notifier.showMessage({
          content: this.isUpdate ? this.$t('saved') : this.$t('created'),
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
        value: 0
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
