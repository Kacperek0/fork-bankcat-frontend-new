import Vue from 'vue'

export default () => {
  Vue.filter('limit', (source, size = 100, end = ' ...') => {
    return source.length > size ? source.slice(0, size - 1) + end : source
  })
}
