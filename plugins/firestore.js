import firebase from 'firebase/app'
import 'firebase/firestore'

if(!firebase.apps.length) {
  let config = {
    apiKey: "AIzaSyAow6lRMcaYSSxy2A8fgEeK84gpzz8CjXg",
    authDomain: "news-app-nuxt-bbc65.firebaseapp.com",
    databaseURL: "https://news-app-nuxt-bbc65.firebaseio.com",
    projectId: "news-app-nuxt-bbc65",
    storageBucket: "news-app-nuxt-bbc65.appspot.com",
    messagingSenderId: "820784833913",
    appId: "1:820784833913:web:a559c230c8839b6e74bba8",
    measurementId: "G-QZLJL8KJ5H"
  }
  firebase.initializeApp(config);
  
}

const db = firebase.firestore()

export default db



