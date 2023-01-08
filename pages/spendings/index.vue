<template>
  <v-container class="d-flex justify-center">
    <v-row class="d-flex justify-center align-center">
      <v-col md="12" lg="10">
        <v-card>
          <v-card-title class="d-flex">
            <div>Spendings</div>

            <v-spacer></v-spacer>

            <v-menu
              v-model="modal.show"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Month date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                type="month"
                @input="modal.show = false"
              ></v-date-picker>
            </v-menu>

          </v-card-title>

          <v-card-text>
            <div class="d-flex">
              <v-btn color="green" class="mb-2" @click.prevent="create">Add spending</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue" class="mb-2" :disabled="selected.length === 0" @click.prevent="assign">Assign to
                category
              </v-btn>
            </div>

            <div class="d-flex align-center">
              <v-text-field
                v-model="filters.query"
                placeholder="Search phrase"
                class="mr-2">
              </v-text-field>
              <v-btn
                small
                color="primary"
                @click.prevent="getDataFromApi">
                Search
              </v-btn>
            </div>

            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="items"
              :loading="isLoading"
              :options.sync="options"
              :items-per-page="1000"
              :footer-props="{
                'items-per-page-options': [10, 50, 100, 1000]
              }"
              :server-items-length="total"
              class="flex-grow-1"
              show-select
            >
              <template #item.amount="{ item }">
                {{ item.amount | money }} pln
              </template>

              <template #item.description="{ item }">
                {{ item.description | limit(40) }}
              </template>

              <template #item.category="{ item }">
                {{ item.category.name }}
              </template>

              <template #item.action="{ item }">
                <div class="d-flex">
                  <v-btn small color="red" class="mx-1" @click="remove(item)">Delete</v-btn>
                </div>
              </template>

            </v-data-table>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
    <SpendingDialogComponent :dialog.sync="dialog.show" @refresh="refresh" />
    <AssignDialogComponent :dialog.sync="assingDialog.show" :selected="assingDialog.selected" @refresh="refresh" />
    <ConfirmDialog ref="confirm" />
  </v-container>
</template>
<script>
import moment from 'moment'
import SpendingDialogComponent from '~/components/spending/SpendingDialogComponent'
import AssignDialogComponent from '~/components/spending/AssignDialogComponent'
import ConfirmDialog from '~/components/dialogs/ConfirmDialog'

export default {
  components: {
    SpendingDialogComponent,
    AssignDialogComponent,
    ConfirmDialog
  },
  data() {
    return {
      filters: {
        query: ''
      },
      assingDialog: {
        show: false,
        selected: []
      },
      dialog: {
        show: false,
        model: null
      },
      modal: {
        show: false
      },
      selected: [],
      isLoading: false,
      total: 0,
      options: {},
      items: [],
      date: moment().format('YYYY-MM'),
      headers: [
        { text: 'Date', align: 'left', value: 'date', sortable: false, width: 110 },
        { text: 'Description', align: 'left', value: 'description', sortable: false },
        { text: 'Category', align: 'left', value: 'category', sortable: false },
        { text: 'Amount', align: 'left', value: 'amount', sortable: false, width: 150 },
        { text: 'Actions', sortable: false, align: 'left', value: 'action', width: 100 }
      ]
    }
  },
  head() {
    return {
      title: 'Spendings'
    }
  },
  watch: {
    options: {
      async handler() {
        await this.getDataFromApi()
      },
      deep: true
    },
    async date() {
      await this.getDataFromApi()
    }
  },
  methods: {
    close() {
      this.dialog = {
        show: false,
        model: null
      }
      this.assingDialog = {
        show: false,
        selected: []
      }
    },
    assign() {
      this.assingDialog = {
        show: true,
        selected: this.selected
      }
    },
    create() {
      this.dialog = {
        show: true,
        model: null
      }
    },
    async refresh() {
      this.selected = []
      await this.getDataFromApi()
    },
    resetTable() {
      this.items = []
      this.total = 0
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
          await this.$axios.$delete(`/api/financial-record/${item.id}`)

          this.$notifier.showMessage({ content: 'Spending deleted', color: 'green' })

          await this.refresh()
        } finally {
          this.isLoading = false
        }
      }
    },
    async getDataFromApi() {
      this.isLoading = true

      try {
        this.resetTable()

        const { page, itemsPerPage } = this.options

        const skip = (page * itemsPerPage) - itemsPerPage
        const limit = itemsPerPage
        const query = this.filters.query && this.filters.query.length > 0 ? this.filters.query : null

        const response = await this.$axios.get('/api/financial-record', {
          params: {
            skip,
            limit,
            query,
            start_date: moment(`${this.date}-1`).format('YYYY-MM-DD')
          }
        })

        if (response) {
          this.items = response.data
          this.total = response.data.length
        }
      } catch (e) {
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
