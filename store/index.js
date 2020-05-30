export const state = () => ({
  headlines: [],
  category: '',
  loading: false
})

export const mutations = {
  setHeadlines(state, headlines) {
    state.headlines = headlines
  },
  setCategory(state, category) {
    state.category = category
  },
  setLoading(state, loading) {
    state.loading = loading
  }
}

export const actions = {
  async loadHeadlines({ commit },apiUrl) {
    commit('setLoading', true)
    const { articles } = await this.$axios.$get(apiUrl)
    commit('setLoading', false)
    commit('setHeadlines', articles)
    

  }
}

export const getters = {
  headlines(state) {
    return state.headlines
  },
  loading(state) {
    return state.loading
  },
  category(state) {
    return state.category
  }
}