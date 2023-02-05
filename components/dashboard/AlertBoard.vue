<template>
  <v-card>
    <v-card-title>{{ $t('alert_board') }}</v-card-title>
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
        <template #item.category="{ item }">
          <v-btn
            text
            small
            plain
            color="secondary"
            class="text-decoration-underline"
            @click="showInsight(item)">
            {{ item.category.name }}
          </v-btn>
        </template>

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

    <CategoryInsightDialogComponent
      :category="insight.category"
      :date="date"
      :dialog.sync="insight.show" />

  </v-card>
</template>
<script>
import moment from 'moment'
import CategoryInsightDialogComponent from '~/components/budget/CategoryInsightDialogComponent'

export default {
  components:{
    CategoryInsightDialogComponent,
  },
  props: {
    date: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      insight: {
        show: false,
        category: null
      },
      items: [],
      isLoading: false,
      total: 0,
      options: {}
    }
  },
  computed: {
    headers(){
      return  [
        { text: this.$t('category'), align: 'left', value: 'category', sortable: false },
        { text: this.$t('spendings'), align: 'left', value: 'category.spendings', sortable: false },
        { text: this.$t('budget'), align: 'left', value: 'budget', sortable: false },
        { text: this.$t('exceeding'), align: 'left', value: 'exceeding', sortable: false }
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
    showInsight(item) {
      this.insight = {
        show: true,
        category: item.category
      }
    },
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
