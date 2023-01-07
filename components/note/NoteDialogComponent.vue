<template>
  <v-dialog
    v-model='show'
    max-width='800px'
    persistent
    scrollable
  >
    <validation-observer
      ref='observer'
      v-slot='{ handleSubmit }'
      slim
    >
      <v-form ref='form' :disabled='isLoading' @submit.prevent='handleSubmit(handle)'>
        <v-card>
          <v-card-title>
            <span class='headline'>{{ isUpdate ? 'Update' : 'Create' }}</span>
          </v-card-title>
          <v-card-text>
            <validation-provider
              v-slot='{ errors }'
              name='title'
              class='d-flex'
              rules='required'
              tag='div'
              vid='title'
            >
              <v-text-field
                v-model='form.title'
                :error-messages='errors'
                label='Title'
                required
              ></v-text-field>
            </validation-provider>

            <validation-provider
              v-slot='{ errors }'
              name='content'
              class='d-flex'
              tag='div'
              vid='content'
            >
              <v-textarea
                v-model='form.content'
                :error-messages='errors'
                label='Content'
              ></v-textarea>
            </validation-provider>

          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class='body-2'
              color='grey'
              text
              @click.native='close'
            >Cancel
            </v-btn>
            <v-btn
              :disabled='isLoading'
              :loading='isLoading'
              class='body-2 '
              color='primary'
              type='submit'
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
import { transformNodeFormErrorsToVeeValidate } from '~/utils'

export default {
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
        title: null,
        content: null
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
      return await this.$axios.post('/api/note', this.form)
    },
    async update() {
      return await this.$axios.patch(`/api/note/${this.model.id}`, this.form)
    },
    hydrate() {
      if (this.model) {
        this.form = {
          title: this.model.title,
          content: this.model.content
        }
      }
    },
    async handle() {
      try {
        this.isLoading = true
        await this[this.isUpdate ? 'update' : 'create']()

        this.$notifier.showMessage({
          content: this.isUpdate ? 'Note saved' : 'Note created',
          color: 'green'
        })

        this.close()
        this.$emit('refresh')
      } catch (err) {
        const { response } = err

        if (response && response.status === 422) {
          this.$refs.observer.setErrors(
            transformNodeFormErrorsToVeeValidate(response.data.errors)
          )
        }
      }
      finally {
        this.isLoading = false
      }
    },
    reset() {
      this.form = {
        title: null,
        content: null
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
