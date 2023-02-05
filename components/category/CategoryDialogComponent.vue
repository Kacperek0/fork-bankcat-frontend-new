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
              :name="$t('name')"
              class="d-flex"
              rules="required"
              tag="div"
              vid="name"
            >
              <v-text-field
                v-model="form.name"
                :error-messages="errors"
                :label="$t('name')"
                required
              ></v-text-field>
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
    }
  },
  data() {
    return {
      isLoading: false,
      show: this.dialog,
      form: {
        name: null
      }
    }
  },
  computed: {
    isUpdate() {
      return !!this.model
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
      return await this.$axios.post('/api/categories', this.form)
    },
    async update() {
      return await this.$axios.put(`/api/categories/${this.model.id}`, this.form)
    },
    hydrate() {
      if (this.model) {
        this.form = {
          name: this.model.name
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
        name: null
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
