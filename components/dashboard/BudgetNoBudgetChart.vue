<template>
  <v-card>
    <v-card-text>
      <ApexChart
        v-if="canShowChart"
        width="100%"
        type="donut"
        :options="options"
        :series="series" />
      <div v-else class="no-data">
        <span>No data found!</span>
      </div>
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
      budgets: [],
      isLoading: false
    }
  },
  computed: {
    hasSpendings() {
      return this.budgets.map((b) => b.category.spendings).reduce((a, b) => a + b, 0) > 0
    },
    canShowChart() {
      return this.budgets.length && this.hasSpendings
    },
    options() {
      return {
        title: {
          text: 'Budgeted vs Non-budgeted expenses',
          align: 'center',
          offsetY: -2
        },
        labels: ['Budgeted', 'Non-budgeted'],
        chart: {
          id: 'budget',
          background: 'rgba(0, 0, 0, 0)'
        },
        theme: {
          mode: 'dark',
          palette: 'palette2'
        },
        legend: {
          position: 'bottom'
        },
        tooltip: {
          y: {
            formatter: (value) => {
              return `${this.$options.filters.money(value)} pln`
            }
          }
        }
      }
    },
    series() {
      const series = []

      series.push(this.budgets.filter((b) => b.id && b.id > 0).map((b) => b.category.spendings).reduce((a, b) => a + b, 0))
      series.push(this.budgets.filter((b) => !b.id || b.id === 0).map((b) => b.category.spendings).reduce((a, b) => a + b, 0))

      return series
    }
  },
  watch: {
    date: {
      async handler() {
        await this.fetch()
      },
      deep: true
    }
  },
  async beforeMount() {
    await this.fetch()
  },
  methods: {
    async fetch() {
      try {
        this.isLoading = true

        const skip = 0
        const limit = 1000

        const response = await this.$axios.get('/api/budget-dashboard', {
          params: {
            skip,
            limit,
            start_date: moment(`${this.date}-1`).format('YYYY-MM-DD')
          }
        })

        this.budgets = response.data.budget

      } catch (e) {
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style type="text/scss" scoped>
.no-data {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
