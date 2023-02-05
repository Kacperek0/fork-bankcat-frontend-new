<template>
  <v-container class="d-flex justify-center">
    <v-row class="d-flex justify-center align-center">
      <v-col lg="12">
        <v-card class="mb-6">
          <v-card-title class="d-flex">
            <div>Dashboard</div>
          </v-card-title>
        </v-card>

        <v-row>
          <v-col cols="12">
            <AlertBoard :date="date" />
          </v-col>

          <v-col cols="12" md="6">
            <CategoryChart :date="date" />
          </v-col>
          <v-col cols="12" md="6">
            <BudgetNoBudgetChart :date="date" />
          </v-col>
        </v-row>

      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import CategoryChart from '~/components/dashboard/CategoryChart'
import BudgetNoBudgetChart from '~/components/dashboard/BudgetNoBudgetChart'
import AlertBoard from '~/components/dashboard/AlertBoard'

export default {
  components: {
    CategoryChart,
    BudgetNoBudgetChart,
    AlertBoard
  },
  head() {
    return {
      title: this.$t('menu.dashboard')
    }
  },
  computed: {
    ...mapGetters('app', {
      date: 'getDate'
    })
  }
}
</script>
