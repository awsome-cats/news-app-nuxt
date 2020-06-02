import md5 from 'md5'
import db from '@/plugins/firestore'
import slugify from 'slugify'
export const strict = false
import { saveUserData, clearUserData } from '@/utils'

export const state = () => ({
  headlines: [],
  feed: [],
  category: '',
  loading: false,
  country: 'jp',
  token: '',
  user: null,
  headline: null,
  source: ''
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
  },
  setHeadline(state, headline) {
    state.headline = headline
  },
  setSource(state,source) {
    state.source = source
  }
}


/**
 * actions
 * 
 * loadHeadlines: 全データ取得
 * headlines: single headlineにslugifyを当てる
 * saveHeadline: headlinesからsingle headlineのタイトルを取得してサブコレクションにセット
 * addHeadlineToFeed: user配下にお気に入りをセット(users/email/feed/渡されたheadline)
 * loadHeadline: each single headlineを取得と同時にコメントも取得する
 */
export const actions = {
  async loadHeadlines({ commit },apiUrl) {
    commit('setLoading', true)
    const { articles } = await this.$axios.$get(apiUrl)
    const headlines = articles.map(article => {
      const slug = slugify(article.title, {
        replacement: '-',
        remove: /[^a-zA-Z0-9 -]/g,
        // remove: undefined,
        lower: true
      })
      const headline = { ...article, slug}
      return headline
    })
    commit('setLoading', false)
    commit('setHeadlines', headlines)
  },
  async saveHeadline(context, headline) {
    const headlineRef = db.collection('headlines').doc(headline.slug)
    let headlineId;
    await headlineRef.get().then(doc => {
      if (doc.exists) {
        headlineId = doc.id
      }
    })
    if (!headlineId) {
      await headlineRef.set(headline)
    } 
  },
  async addHeadlineToFeed({state}, headline) {
    const feedRef = db.collection(`users/${ state.user.email }/feed`).doc(headline.title)
    // .orderBy('title', 'desc')
    await feedRef.set(headline)
  },
  
  async loadHeadline({ commit }, headlineSlug) {
    // get single headline
    const headlineRef = db.collection('headlines').doc(headlineSlug)
    // get comment of single headline
    const commentsRef = db.collection(`headlines/${ headlineSlug }/comments`).orderBy('likes', 'desc')

    let loadedHeadline = {}
    await headlineRef.get().then(async doc => {
      
      // doc.dataを空のloadedHeadlineに格納
      if (doc.exists) {
        loadedHeadline = doc.data()
        //　オブジェクトかどうか確認
        // console.log('loadedHeadline', loadedHeadline)

        // コメントのスナップショットを取得
        await commentsRef.get().then(querySnapshot => {
          if(querySnapshot.empty) {
            commit('setHeadline', loadedHeadline)
          }
          let loadedComments = []
          querySnapshot.forEach(doc => {
            loadedComments.push(doc.data())
            loadedHeadline['comments'] = loadedComments
            commit('setHeadline', loadedHeadline)
          })
          
        })
      }
    })
  },
  async removeHeadlineFromFeed({state}, headline) {
    const headlineRef = db.collection(`users/${ state.user.email }/feed`).doc(headline.title)
    await headlineRef.delete()
  },
  async loadUserFeed({state, commit}) {
    if(state.user) {
      const feedRef = db.collection(`users/${ state.user.email }/feed`)
      
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
  async sendComment({state, commit}, comment) {
    // commentを追加する場所を決定
    const commentsRef = db.collection(`headlines/${ state.headline.slug }/comments`)
    commit('setLoading', true)
    // commentを追加
    await commentsRef.doc(comment.id).set(comment)
    await commentsRef.orderBy('likes', 'desc').get().then(querySnapshot => {
      let comments = []
      querySnapshot.forEach(doc => {
        comments.push(doc.data())
        const updatedHeadline = { ...state.headline, comments}
        commit('setHeadline', updatedHeadline)
      })
    })
    commit('setLoading', false)
  },
  async likeComment({ state, commit }, commentId) {
    const commentsRef = db.collection(`headlines/${ state.headline.slug }/comments`)
    .orderBy('likes', 'desc')
    const likedCommentRef = db.collection('headlines').doc(state.headline.slug)
    .collection('comments').doc(commentId)

    await likedCommentRef.get().then(doc => {
      if(doc.exists) {
        const prevLikes = doc.data().likes
        const currentLikes = prevLikes + 1
        likedCommentRef.update({
          likes:currentLikes
        })
      }
    })
    await commentsRef.onSnapshot(querySnapshot => {
      let loadedComments = []
      querySnapshot.forEach(doc => {
        loadedComments.push(doc.data())
        const updatedHeadline = {
          ...state.headline,
          comments: loadedComments
        }
        commit('setHeadline', updatedHeadline)
      })
    })
  },
  async authenticateUser({ commit }, userPayload) {
    try {
      commit('setLoading', true)
      const authUserData = await this.$axios.$post(`/${ userPayload.action }/`, {
        email: userPayload.email,
        password: userPayload.password,
        returnSecureToken: userPayload.returnSecureToken
      })

      let user

      if(userPayload.action === 'register') {
        const avatar = `http://gravatar.com/avatar/${ md5(authUserData.email) }?d=identicon`
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
  },
  headline(state) {
    return state.headline
  },
  source (state) {
    return state.source
  }
}