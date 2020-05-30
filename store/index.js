export const state = () => ({
  headlines: [],
  category: '',
  loading: false,
  country: 'jp',
  token: ''
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
  },
  setCountry(state, country) {
    state.country = country
  },
  setToken(state, token) {
    state.token = token
  }
}

export const actions = {
  async loadHeadlines({ commit },apiUrl) {
    commit('setLoading', true)
    const { articles } = await this.$axios.$get(apiUrl)
    commit('setLoading', false)
    commit('setHeadlines', articles)
  },
  async authenticateUser({ commit }, userPayload) {
    try {
      commit('setLoading', true)
      const authUserData = await this.$axios.$post('/register/', userPayload)
      commit('setToken', authUserData.idToken)
      console.log(authUserData)
    } catch(error) {
      console.log(error)
      commit('setLoading', false)
    }
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
  },
  country(state) {
    return state.country
  },
  isAuthenticated(state) {
    return !!state.token
  }
}