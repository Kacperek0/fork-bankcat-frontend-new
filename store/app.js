import moment from 'moment'

export const state = () => ({
  date: moment().format('YYYY-MM')
})

export const getters = {
  getDate: (state) => state.date
}

export const mutations = {
  SET_DATE(state, date) {
    state.date = date
  }
}

export const actions = {
  setDate({ commit }, date) {
    commit('SET_DATE', date)
  }
}
