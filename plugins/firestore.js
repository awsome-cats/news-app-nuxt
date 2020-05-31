import firebase from 'firebase/app'
import 'firebase/firestore'

if(!firebase.apps.length) {
  let config = {
    apiKey: "AIzaSyCmSy3zGYZt3roN2JKXwLwRee4JIkgwfjU",
    authDomain: "news-app-nuxt.firebaseapp.com",
    databaseURL: "https://news-app-nuxt.firebaseio.com",
    projectId: "news-app-nuxt",
    storageBucket: "news-app-nuxt.appspot.com",
    messagingSenderId: "940228939289",
    appId: "1:940228939289:web:1cd6865bd984dbf7242488",
    measurementId: "G-8CR6RTBSJK"
  }
  firebase.initializeApp(config);
  
}

const db = firebase.firestore()

export default db



