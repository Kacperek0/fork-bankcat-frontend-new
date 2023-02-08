<template>
  <v-card>
    <v-card-text>
      <ApexChart
        v-if="canShowChart"
        type="pie"
        :options="options"
        :series="series" />
      <div v-else class="no-data">
        <span>{{ $t('no_spendings_found') }}</span>
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
      categories: [],
      isLoading: false
    }
  },
  computed: {
    hasSpendings() {
      return this.categories.map((s) => s.spendings).reduce((a, b) => a + b, 0) > 0
    },
    canShowChart() {
      return this.categories.length > 0 && this.hasSpendings
    },
    options() {
      return {
        title: {
          text: this.$t('category_expsenses'),
          align: 'center',
          offsetY: -2
        },
        labels: this.categories.map((c) => c.name),
        chart: {
          id: 'category',
          background: 'rgba(0, 0, 0, 0)'
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              height: 600
            }
          }
        }],
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
      return this.categories.map((c) => c.spendings)
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

        const response = await this.$axios.get('/api/categories-dashboard', {
          params: {
            skip,
            limit,
            start_date: moment(`${this.date}-1`).format('YYYY-MM-DD')
          }
        })

        this.categories = response.data.categories

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
