<template>
  <span :class="[`fi fi-${flag}`, { 'fi--round': round }]"></span>
</template>

<script>
import 'flag-icons/css/flag-icons.min.css'

/*
|---------------------------------------------------------------------
| Flag Icon Component
|---------------------------------------------------------------------
|
| Show by country code the respective flag for that country
| https://github.com/lipis/flag-icon-css
|
*/
export default {
  props: {
    // Country ISO
    flag: {
      type: String,
      default: 'us'
    },
    // Circle flag or square
    round: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.fi {
  height: 22px;
  aspect-ratio: 1/1;

  &--round {
    background-size: cover;
    border-radius: 100%;
    height: 26px;
    aspect-ratio: 1/1;
  }
}
</style>
