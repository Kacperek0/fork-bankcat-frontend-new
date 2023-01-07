export const state = () => ({
  content: '',
  color: 'blue',
  timeout: 2000,
  showClose: true,
  icon: 'information',
  right: true,
  left: false,
  top: true,
  bottom: false,
  centered: false
})

export const mutations = {
  showMessage(state, payload) {
    state.right = true
    state.left = false
    state.top = true
    state.bottom = false
    state.centered = false

    Object.keys(payload).forEach((key) => {
      if (typeof state[key] !== 'undefined') {
        state[key] = payload[key]
      }
    })
  }
}
