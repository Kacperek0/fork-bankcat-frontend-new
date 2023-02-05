export default ({ app, store }) => {
  if (app.router.currentRoute.query?.date) {
    store.dispatch('app/setDate', app.router.currentRoute.query.date)
  }

  store.watch(
    () => store.getters['app/getDate']
    , (getDate) => {
      const query = {
        date: getDate
      }

      if (!getDate) {
        delete query.date
      }

      const route = {
        ...app.router.currentRoute,
        query
      }

      app.router.push(route)
    }
  )
}
