import md5 from 'md5'

export const state = () => ({
  headlines: [],
  category: '',
  loading: false,
  country: 'jp',
  token: '',
  user: null
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
  },
  setUser(state, user) {
    state.user = user
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
      const avatar = `http://gravatar.com/avatar/${md5(authUserData.email)}?d=identicon`
      const user = { email: authUserData.email, avatar}
      commit('setUser', user)
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
  },
  user(state) {
    return state.user
  }
}