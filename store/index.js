import md5 from 'md5'
import db from '@/plugins/firestore'
export const strict = false
import { saveUserData, clearUserData } from '@/utils'

export const state = () => ({
  headlines: [],
  feed: [],
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
  },
  setFeed(state, headlines) {
    state.feed = headlines
  },
  clearFeed(state) {
    state.feed = []
  }
}

export const actions = {
  async loadHeadlines({ commit },apiUrl) {
    commit('setLoading', true)
    const { articles } = await this.$axios.$get(apiUrl)
    commit('setLoading', false)
    commit('setHeadlines', articles)
  },
  async addHeadlineToFeed({state}, headline) {
    const feedRef = db.collection(`users/${state.user.email}/feed`).doc(headline.title)
    await feedRef.set(headline)
  },
  async removeHeadlineFromFeed({state}, headline) {
    const headlineRef = db.collection(`users/${state.user.email}/feed`).doc(headline.title)
    await headlineRef.delete()
  },
  async loadUserFeed({state, commit}) {
    if(state.user) {
      const feedRef = db.collection(`users/${state.user.email}/feed`)
      
      await feedRef.onSnapshot(querySnapshot => {
      let headlines = []
      querySnapshot.forEach(doc => {
        headlines.push(doc.data())
        commit('setFeed', headlines)
      })
      // feedを空にしたい時
      if (querySnapshot.empty) {
        headlines = []
        commit('setFeed', headlines)
      }
    })
    }
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
        await db.collection('users').doc(userPayload.email).set(user)
      } else {
        const loginRef = db.collection('users').doc(userPayload.email)
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
    context.commit('clearFeed')
    clearUserData()
  }
}



export const getters = {
  headlines(state) {
    return state.headlines
  },
  feed(state) {
    return state.feed
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