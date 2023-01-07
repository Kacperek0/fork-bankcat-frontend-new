<template>
  <v-dialog
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
  >
    <v-card>
      <v-card-title class="card-header">
        <span class="bar primary"></span>
        <span class="subtitle-1 ">{{ title }}</span>
      </v-card-title>
      <v-card-text class="pl-3 font-weight-medium d-flex flex-row">
        <v-icon class="mr-1" color="orange">mdi-alert</v-icon>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :class="options.btnCancelClass" :color="options.btnCancelType" text @click.native="cancel">
          {{ options.btnCancel }}
        </v-btn>
        <v-btn :class="options.btnOkClass" :color="options.btnOkType" type="submit" @click.native="agree">
          {{ options.btnOk }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'ConfirmDlg',
  data() {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      message: null,
      title: null,
      options: {
        width: 400,
        zIndex: 200,

        btnCancel: 'Cancel',
        btnCancelType: 'default',
        btnCancelClass: 'grey--text',

        btnOk: 'Yes, delete',
        btnOkType: 'primary',
        btnOkClass: ['px-2']
      }
    }
  },

  methods: {
    open(title, message, options) {
      this.dialog = true
      this.title = title
      this.message = message
      this.options = Object.assign(this.options, options)

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agree() {
      this.resolve(true)
      this.dialog = false
    },
    cancel() {
      this.resolve(false)
      this.dialog = false
    }
  }
}
</script>
