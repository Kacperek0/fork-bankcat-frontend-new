<template>
  <v-dialog
    v-model="show"
    max-width="800px"
    scrollable
    @click:outside="close"
  >
    <v-card v-if="category">
      <v-card-title>
        <div>
          <div class="headline">Category insights</div>
          <div class="primary--text">{{ category.name }}</div>
        </div>
      </v-card-title>
      <v-card-text>

        <v-card elevation="2" class="mb-4">
          <v-card-title>
            Total spendings on:
          </v-card-title>
          <v-card-text>
            <div class="pink--text text-h3 font-weight-bold">{{ category.spendings | money }} pln</div>
          </v-card-text>
        </v-card>

        <v-data-table
          :headers="headers"
          :items="items"
          :loading="isLoading"
          :options.sync="options"
          :items-per-page="-1"
          class="flex-grow-1"
        >
          <template #item.amount="{ item }">
            {{ item.amount | money }} pln
          </template>

          <template #item.description="{ item }">
            {{ item.description | limit(60) }}
          </template>
        </v-data-table>

      </v-card-text>
    </v-card>

  </v-dialog>
</template>
<script>
import moment from 'moment'
import RequestMixin from '~/mixins/RequestMixin'

export default {
  mixins: [RequestMixin],
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    category: {
      type: Object,
      default: null
    },
    date: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      show: this.dialog,
      items: [],
      total: 0,
      options: {},
      form: {
        value: 0
      },
      headers: [
        { text: 'Date', align: 'left', value: 'date', sortable: false, width: 110 },
        { text: 'Description', align: 'left', value: 'description', sortable: false },
        { text: 'Amount', align: 'right', value: 'amount', sortable: false, width: 150 }
      ]
    }
  },
  watch: {
    async show(show) {
      if (show && this.category) {
        await this.getDataFromApi()
      }
    },
    // options: {
    //   async handler() {
    //     await this.getDataFromApi()
    //   },
    //   deep: true
    // },
    dialog(dialog) {
      this.show = dialog
    },
    category: {
      handler() {
        this.reset()
      },
      deep: true
    }
  },
  methods: {
    reset() {
      this.items = []
    },
    async getDataFromApi() {
      if (!this.show || this.isLoading) {
        return
      }

      this.isLoading = true

      try {
        this.reset()

        // const { page, itemsPerPage } = this.options

        // const skip = (page * itemsPerPage) - itemsPerPage
        // const limit = itemsPerPage

        const response = await this.$axios.get('/api/financial-record-by-category', {
          params: {
            skip: 0,
            limit: 1000,
            start_date: moment(`${this.date}-1`).format('YYYY-MM-DD'),
            category_id: this.category.id
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
    },
    close() {
      this.$emit('update:dialog', false)
    }
  }
}
</script>
