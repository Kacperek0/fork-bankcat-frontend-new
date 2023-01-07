import Vue from 'vue'

export default () => {
  Vue.filter('money', (value) => {
    if (isNaN(Number(value))) {
      return 0
    }

    return (Number(value) / 100).toFixed(2)
  })
}
