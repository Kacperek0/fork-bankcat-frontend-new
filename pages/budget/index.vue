<template>
  <v-container class="d-flex justify-center">
    <v-row class="d-flex justify-center align-center">
      <v-col md="12" lg="10">
        <v-card>
          <v-card-title class="d-flex">
            <div>Budget</div>

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
            <v-data-table
              :headers="headers"
              :items="items"
              :loading="isLoading"
              :options.sync="options"
              :items-per-page="-1"
              :server-items-length="total"
              class="flex-grow-1"
            >
              <template #item.category.spendings="{ item }">
                {{ item.category.spendings | money }} pln
              </template>

              <template #item.budget="{ item }">
                <span v-if="item.budget <= 0" class="pink--text">
                  No budget
                </span>
                <template v-else>
                  {{ item.budget | money }} pln
                </template>
              </template>

              <template #item.result="{ item }">
                <div v-if="item.budget <= 0" class="font-italic">
                  No budget set!
                </div>
                <div v-else-if="(item.budget) >= item.category.spendings" class="green--text">
                  You are in control of Your spendings!
                </div>
                <div v-else class="pink--text">
                  Budget exceeded!
                </div>
              </template>

              <template #item.action="{ item }">
                <div class="d-flex">
                  <template v-if="item.budget === 0">
                    <v-btn small color="green" class="mx-1" @click="create(item)">Set</v-btn>
                  </template>
                  <template v-else>
                    <v-btn small color="primary" class="mx-1" @click="edit(item)">Edit</v-btn>
                    <v-btn small color="red" class="mx-1" @click="remove(item)">Delete</v-btn>
                  </template>
                </div>
              </template>

            </v-data-table>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
    <BudgetDialogComponent
      :model="dialog.model"
      :category="dialog.category"
      :dialog.sync="dialog.show"
      :spending="dialog.spending"
      @refresh="refresh" />
    <ConfirmDialog ref="confirm" />
  </v-container>
</template>
<script>
import moment from 'moment'
import BudgetDialogComponent from '~/components/budget/BudgetDialogComponent'
import ConfirmDialog from '~/components/dialogs/ConfirmDialog'

export default {
  components: {
    BudgetDialogComponent,
    ConfirmDialog
  },
  data() {
    return {
      dialog: {
        show: false,
        model: null,
        category: null,
        spending: 0
      },
      modal: {
        show: false
      },
      date: moment().format('YYYY-MM'),
      isLoading: false,
      total: 0,
      options: {},
      items: [],
      headers: [
        { text: 'Category', align: 'left', value: 'category.name', sortable: false },
        { text: 'Spendings', align: 'left', value: 'category.spendings', sortable: false },
        { text: 'Budget', align: 'left', value: 'budget', sortable: false },
        { text: 'Result', align: 'left', value: 'result', sortable: false },
        { text: 'Actions', sortable: false, align: 'left', value: 'action', width: 200 }
      ]
    }
  },
  head() {
    return {
      title: 'Budget'
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
        model: null,
        category: null,
        spending: 0
      }
    },
    create(item) {
      this.dialog = {
        show: true,
        model: null,
        category: item.category,
        spending: item.category.spendings
      }
    },
    edit(model) {
      this.dialog = {
        show: true,
        model,
        category: model.category,
        spending: model.category.spendings
      }
    },
    async refresh() {
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
          await this.$axios.$delete(`/api/budget/${item.id}`)

          this.$notifier.showMessage({ content: 'Budget deleted', color: 'green' })

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

        const skip = 0
        const limit = 1000

        const response = await this.$axios.get('/api/budget-dashboard', {
          params: {
            skip,
            limit,
            start_date: moment(`${this.date}-1`).format('YYYY-MM-DD')
          }
        })

        if (response) {
          this.items = response.data.budget
          this.total = response.data.budget.length
        }
      } catch (e) {
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
