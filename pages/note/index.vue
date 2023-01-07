<template>
  <v-container class='d-flex justify-center'>
    <v-row class='d-flex justify-center align-center'>
      <v-col md='12' lg='10'>
        <v-card>
          <v-card-title class='d-flex'>
            <div>My notes</div>
            <div class='ml-auto'>
              <v-btn x-small text @click.prevent='$auth.logout()'>Logout</v-btn>
            </div>
          </v-card-title>

          <v-card-text>
            <v-btn color='green' class='mb-2' @click.prevent='create'>Add note</v-btn>

            <v-data-table
              :headers='headers'
              :items='items'
              :loading='isLoading'
              :options.sync='options'
              :server-items-length='total'
              class='flex-grow-1'
            >

              <template #item.created_at='{ item }'>
                <div>{{ item.created_at | formatDate('ll HH:mm') }}</div>
              </template>

              <template #item.action='{ item }'>
                <div class='d-flex'>
                  <v-btn small color='primary' class='mx-1' @click='edit(item)'>Edit</v-btn>
                  <v-btn small color='red' class='mx-1' @click='remove(item)'>Delete</v-btn>
                </div>
              </template>

            </v-data-table>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
    <NoteDialogComponent :model='dialog.model' :dialog.sync='dialog.show' @refresh='refresh' />
    <ConfirmDialog ref="confirm" />
  </v-container>
</template>
<script>
import NoteDialogComponent from '~/components/note/NoteDialogComponent'
import ConfirmDialog from '~/components/dialogs/ConfirmDialog'

export default {
  components: {
    NoteDialogComponent,
    ConfirmDialog
  },
  data() {
    return {
      dialog: {
        show: false,
        mode: null
      },
      isLoading: false,
      total: 0,
      options: {},
      items: [],
      headers: [
        { text: 'Id', align: 'left', value: 'id', sortable: false },
        { text: 'Title', align: 'left', value: 'title', sortable: false },
        { text: 'Create Date', align: 'left', value: 'created_at', sortable: false },
        { text: 'Actions', sortable: false, align: 'left', value: 'action' }
      ]
    }
  },
  head() {
    return {
      title: 'My notes'
    }
  },
  watch: {
    options: {
      async handler() {
        await this.getDataFromApi()
      },
      deep: true
    }
  },
  methods: {
    close() {
      this.dialog = {
        show: false,
        model: null
      }
    },
    create() {
      this.dialog = {
        show: true,
        model: null
      }
    },
    edit(item) {
      this.dialog = {
        show: true,
        model: item
      }
    },
    async refresh() {
      await this.getDataFromApi()
    },
    resetTable() {
      this.items = []
      this.total = 0
    },
    async getDataFromApi() {
      this.isLoading = true

      try {
        this.resetTable()

        const { page, itemsPerPage } = this.options

        const response = await this.$axios.get('/api/note', {
          params: {
            page,
            perPage: itemsPerPage
          }
        })

        if (response) {
          this.items = response.data.data

          this.total = response.data?.meta?.total ?? this.items.length
        }
      } catch (e) {
      } finally {
        this.isLoading = false
      }
    },
    async remove(item) {
      if (
        await this.$refs.confirm.open(
          'Confirmation',
          'Are you sure?',
          {
            btnCancel: 'Cancel',
            btnOk: 'Yes, delete'
          }
        )
      ) {
        try {
          this.isLoading = true
          await this.$axios.$delete(`/api/note/${item.id}`)

          this.$notifier.showMessage({ content: 'Note deleted', color: 'green' })

          await this.refresh()
        } finally {
          this.isLoading = false
        }
      }
    }
  }
}
</script>
