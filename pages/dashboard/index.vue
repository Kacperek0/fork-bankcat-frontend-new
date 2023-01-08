<template>
  <v-container class="d-flex justify-center">
    <v-row class="d-flex justify-center align-center">
      <v-col lg="12">
        <v-card class="mb-6">
          <v-card-title class="d-flex">
            <div>Dashboard</div>

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
        </v-card>

        <v-row>
          <v-col lg="12">
            <AlertBoard :date="date" />
          </v-col>

          <v-col cols="6">
            <CategoryChart :date="date" />
          </v-col>
          <v-col cols="6">
            <BudgetNoBudgetChart :date="date" />
          </v-col>
        </v-row>

      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import moment from 'moment'
import CategoryChart from '~/components/dashboard/CategoryChart'
import BudgetNoBudgetChart from '~/components/dashboard/BudgetNoBudgetChart'
import AlertBoard from '~/components/dashboard/AlertBoard'

export default {
  components: {
    CategoryChart,
    BudgetNoBudgetChart,
    AlertBoard
  },
  data() {
    return {
      modal: {
        show: false
      },
      date: moment().format('YYYY-MM')
    }
  }
}
</script>
