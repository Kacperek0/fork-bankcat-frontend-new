<template>
  <v-snackbar
    v-model="show"
    :color="bgColor"
    :icon="icon"
    :timeout="timeout"
    absolute
    close-icon="close"
    show-close
    :left="left"
    :right="right"
    :top="top"
    :bottom="bottom"
    :centered="centered"
  >

    <div class="d-flex align-center">
      <v-icon v-if="icon" :style="{color: textColor}" class="mr-2">{{ `mdi-${icon}` }}</v-icon>
      <span :style="{color: textColor}" class="">
        {{ content }}
      </span>
    </div>

    <template #action>
      <v-btn
        class="ml-auto"
        icon
        text
        @click="closeSnackBar"
      >
        <v-icon :color="textColor">mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      content: '',
      bgColor: '',
      textColor: '',
      icon: '',
      timeout: 2000,
      right: true,
      left: false,
      top: true,
      bottom: false,
      centered: false
    }
  },

  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/showMessage') {

        const bgColorsMap = {
          green: 'rgba(76, 175,80,12%)',
          red: 'rgba(245,108,108, 20%)',
          blue: 'rgba(0,120,240,12%)'
        }

        const textColorsMap = {
          green: 'rgba(76, 175,80,100%)',
          red: 'rgba(245,108,108, 100%)',
          blue: 'rgba(0,120,240,100%)'
        }

        this.show = true

        Object.keys(state.snackbar).forEach((key) => {
          if (typeof this[key] !== 'undefined') {
            this[key] = state.snackbar[key]
          }
        })

        this.bgColor = bgColorsMap[state.snackbar.color] || state.snackbar.color
        this.textColor = textColorsMap[state.snackbar.color] || 'black'
      }
    })
  },
  methods: {
    closeSnackBar() {
      this.show = false
    }
  }
}
</script>
