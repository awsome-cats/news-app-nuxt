import firebase from 'firebase/app'
import 'firebase/auth'

export default function ({store}) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      store.getters.login_user
      console.log('user logged in')
    } else {
      console.log('user does not log in')
    }
  })
}
