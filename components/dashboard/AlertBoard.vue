<template>
  <v-card>
    <v-card-title>Alert board</v-card-title>
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
          <div class="pink--text">
            {{ item.category.spendings | money }} pln
          </div>
        </template>

        <template #item.budget="{ item }">
          <div class="green--text">
            {{ item.budget | money }} pln
          </div>
        </template>

        <template #item.exceeding="{ item }">
          <div class="pink--text font-weight-bold">
            !!! {{ (item.category.spendings - item.budget) | money }} pln !!!
          </div>
        </template>

      </v-data-table>

    </v-card-text>
  </v-card>
</template>
<script>
import moment from 'moment'

export default {
  props: {
    date: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      items: [],
      isLoading: false,
      total: 0,
      options: {},
      headers: [
        { text: 'Category', align: 'left', value: 'category.name', sortable: false },
        { text: 'Spendings', align: 'left', value: 'category.spendings', sortable: false },
        { text: 'Budget', align: 'left', value: 'budget', sortable: false },
        { text: 'Exceeding', align: 'left', value: 'exceeding', sortable: false }
      ]
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
    resetTable() {
      this.items = []
      this.total = 0
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
          this.items = response.data.budget.filter((b) => b.budget > 0 && (b.budget) < b.category.spendings)
          this.total = this.items.length
        }
      } catch (e) {
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
