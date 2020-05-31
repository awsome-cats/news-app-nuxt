const pkg = require('./package')
require('dotenv').config()
module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons'}
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#9ccc65', height:'10px' },

  /*
  ** Global CSS
  */
  css: [
    { src: 'vue-material/dist/vue-material.min.css',
      lang: 'css'
    },
    { src: '@/assets/theme.scss', lang: 'scss'}
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src: '@/plugins/vue-material'},
    {src: '@/plugins/axios'},
    {src: '@/plugins/firestore'}
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    credentials: true,
    proxy:true
    // See https://github.com/nuxt-community/axios-module#options
  },
  proxy: {
    '/api/': {
      target: 'https://newsapi.org/v2/',
      pathRewrite: { '^/api/': ''}
    },
    '/register/': {
      target: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+ process.env.FB_API_KEY,
      pathRewrite: { '^/register/': ''}
    },
    '/login/': {
      target: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + process.env.FB_API_KEY,
      pathRewrite: { '^/login/': ''}
    }
  },
  env: {
    NEWS_API_KEY:process.env.NEWS_API_KEY,
    FB_API_KEY:process.env.FB_API_KEY
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    }
  }
}
