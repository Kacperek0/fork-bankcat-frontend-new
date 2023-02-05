<template>
  <v-container class="d-flex justify-center">
    <v-row class="d-flex justify-center align-center">
      <v-col md="12" lg="10">
        <v-card>
          <v-card-title class="d-flex">
            <div>{{ $t('menu.spendings') }}</div>
          </v-card-title>

          <v-card-text>
            <div class="d-flex">
              <v-btn color="green" class="mb-2" @click.prevent="create">{{ $t('add_spending') }}</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue" class="mb-2" :disabled="selected.length === 0" @click.prevent="assign">
                {{ $t('assign_to_category') }}
              </v-btn>
            </div>

            <div class="d-flex align-center">
              <v-text-field
                v-model="query"
                placeholder="Search phrase"
                clearable
                class="mr-2"
                @change="queryChanged">
              </v-text-field>
            </div>

            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="items"
              :loading="isLoading"
              :options.sync="options"
              :items-per-page="50"
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
                <template v-if="item.category">
                  {{ item.category.name }}
                </template>
                <div class="grey--text caption font-italic">{{ $t('no_category') }}</div>

              </template>

              <template #item.action="{ item }">
                <div class="d-flex">
                  <v-btn small color="red" class="mx-1" @click="remove(item)">{{ $t('delete') }}</v-btn>
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
import { mapGetters } from 'vuex'
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
      query: null,
      queryTimeout: null,
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
      selected: [],
      isLoading: false,
      total: 0,
      options: {},
      items: []
    }
  },
  head() {
    return {
      title: this.$t('menu.spendings')
    }
  },
  computed: {
    headers(){
      return  [
        { text: this.$t('date'), align: 'left', value: 'date', sortable: false, width: 110 },
        { text: this.$t('description'), align: 'left', value: 'description', sortable: false },
        { text: this.$t('category'), align: 'left', value: 'category', sortable: false },
        { text: this.$t('amount'), align: 'left', value: 'amount', sortable: false, width: 150 },
        { text: this.$t('actions'), sortable: false, align: 'left', value: 'action', width: 100 }
      ]
    },
    ...mapGetters('app', {
      date: 'getDate'
    })
  },
  watch: {
    query(query) {
      this.filters.query = query
      this.queryChanged()
    },
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
    queryChanged() {
      clearTimeout(this.queryTimeout)
      if (this.filters.query && this.filters.query.length > 0 && this.filters.query.length < 3) {
        return
      }
      this.queryTimeout = setTimeout(() => {
        this.getDataFromApi()
      }, 500)
    },
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
          this.$t('confirmation'),
          this.$t('are_you_sure'),
          {
            btnCancel: this.$t('cancel'),
            btnOk: this.$t('yes')
          }
        )
      ) {
        try {
          this.isLoading = true
          await this.$axios.$delete(`/api/financial-record/${item.id}`)

          this.$notifier.showMessage({ content: this.$t('deleted'), color: 'green' })

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
          this.items = response.data.records
          this.total = response.data.total
        }
      } catch (e) {
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
