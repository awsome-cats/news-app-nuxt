import md5 from 'md5'
import db from '@/plugins/firestore'
import { saveUserData, clearUserData } from '@/utils'

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
  },
  clearToken(state) {
    state.token = ''
  },
  clearUser(state) {
    state.user = null
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
      const authUserData = await this.$axios.$post(`/${userPayload.action}/`, {
        email: userPayload.email,
        password: userPayload.password,
        returnSecureToken: userPayload.returnSecureToken
      })

      let user

      if(userPayload.action === 'register') {
        const avatar = `http://gravatar.com/avatar/${md5(authUserData.email)}?d=identicon`
        user = { email: authUserData.email, avatar}
        await db.collection('user').doc(userPayload.email).set(user)
      } else {
        const loginRef = db.collection('user').doc(userPayload.email)
        const loggedInUser = await loginRef.get()
        user = loggedInUser.data()
      }
      
      commit('setUser', user)
      commit('setToken', authUserData.idToken)
      commit('setLoading', false)
      console.log(authUserData)
      // Cookie & localStorage
      saveUserData(authUserData, user)
      
    } catch(error) {
      console.log(error)
      commit('setLoading', false)
    }
  },
  setLogoutTimer(context, interval) {
    setTimeout(() => context.dispatch('logoutUser'), interval)
  },
  logoutUser(context) {
    context.commit('clearToken')
    context.commit('clearUser')
    clearUserData()
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