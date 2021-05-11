import { saveUserData, clearUserData } from '@/utils'
import db from '@/plugins/firestore'
/*
*store/user.js
*/

export const state = () => ({
  user: null,
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  clearUser(state) {
    state.user = null
  },
}



export const actions = {
  async authenticateUser({ commit }, userPayload) {
    try {
      commit('setLoading', true)
      const authUserData = await this.$axios.$post(`/${ userPayload.action }/`, {
        email: userPayload.email,
        password: userPayload.password,
        returnSecureToken: userPayload.returnSecureToken
      })
      console.log('auth', authUserData)

      let user
        // userPayload.email ==> userPayload.localIdにやってみた
      if(userPayload.action === 'register') {
        const avatar = `http://gravatar.com/avatar/${ md5(authUserData.email) }?d=identicon`
        user = { email: authUserData.email, avatar, localId: authUserData.localId}
        await db.collection('users').doc(userPayload.email).set(user)
      } else {
        const loginRef = db.collection('users').doc(userPayload.email)
        const loggedInUser = await loginRef.get()
        user = loggedInUser.data()
      }
      
      commit('setUser', user)
      // commit('setUserId', authUserData.localId)
      commit('setToken', authUserData.idToken)
      commit('setLoading', false)
      // console.log(authUserData)
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

  user(state) {
    return state.user
  }
}