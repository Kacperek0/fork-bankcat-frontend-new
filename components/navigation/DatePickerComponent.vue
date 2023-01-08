<template>
  <v-menu
    v-model="modal.show"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    left
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
  data() {
    return {
      modal: {
        show: false
      }
    }
  }, computed: {
    ...mapGetters('app', {
      date: 'getDate'
    })
  },
  methods: {
    changeDate(date) {
      this.modal.show = false
      this.$store.dispatch('app/setDate', date)
    }
  }
}
</script>
