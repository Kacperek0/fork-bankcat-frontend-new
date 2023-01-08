<template>
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
        :value="date"
        prepend-icon="mdi-calendar"
        readonly
        :hide-details="true"
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      :value="date"
      type="month"
      @input="changeDate"
    ></v-date-picker>
  </v-menu>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('app', {
      date: 'getDate'
    })
  },
  data() {
    return {
      modal: {
        show: false
      }
    }
  },
  methods: {
    changeDate(date) {
      this.modal.show = false
      this.$store.dispatch('app/setDate', date)
    }
  }
}
</script>
