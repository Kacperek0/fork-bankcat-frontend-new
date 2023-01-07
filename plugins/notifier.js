export default ({ app, store }, inject) => {
  inject('notifier', {
    showMessage (options) {
      store.commit('snackbar/showMessage',options)
    }
  })
}
