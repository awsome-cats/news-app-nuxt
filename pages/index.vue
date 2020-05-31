<template>
  <div class="md-layout md-alignment-center" style="margin: 4em 0">
    <!-- Top Navbar Start -->
    <md-toolbar class="fixed-toolbar" elevation="1">
      <md-button @click="showLeftSidePanel=true" class="md-icon-button">
        <md-icon>menu</md-icon>
      </md-button>
      <nuxt-link class="md-primary md-title" to="/">
      Nuxt News
      </nuxt-link>
      <div class="md-toolbar-section-end">
        <!-- Avatar Image -->
        <template v-if="isAuthenticated">
          <md-button>
            <md-avatar>
              <img :src="user.avatar" :alt="user.email" />
            </md-avatar>
            {{user.email}}
          </md-button>
          <md-button>ログアウト</md-button>
        </template>
        <template v-else>
          <md-button @click="$router.push('/login')">Login</md-button>
          <md-button @click="$router.push('/register')">Register</md-button>
        </template>
        
        <md-button @click="showRightSidePanel = true">
          Category
        </md-button>
      </div>
    </md-toolbar>
    <!-- Top Navbar End-->

    <!-- Personal News Feed (left drawer) -->
    <md-drawer md-fixed :md-active.sync="showLeftSidePanel">
      <md-toolbar md-title>Personal Feed</md-toolbar>
      <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>
      <md-field>
        <label for="country">Country</label>
        <md-select name="country" :value="country" id="country" @input="changeCountry">
          <md-option value="jp">日本</md-option>
          <md-option value="us">アメリカ</md-option>
          <md-option value="de">カナダ</md-option>
          <md-option value="ca">ドイツ</md-option>
        </md-select>
      </md-field>
    </md-drawer>

    <!-- News Categories (Right Drawer) Start -->
    <md-drawer class="md-right" md-fixed :md-active.sync="showRightSidePanel">
      <md-toolbar :md-elevation="1">
        <span class="md-title">News Categories</span>
      </md-toolbar>
      <!-- Progress bar -->
      <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>
      
      <!-- List in Drawer Start -->
      <md-list>
        <md-subheader class="md-primary">Categories</md-subheader>
        <md-list-item v-for="(newsCategory, i) in newsCategories" :key="i" @click="loadCategory(newsCategory.path)">
          <md-icon :class="newsCategory.path === category ? 'md-primary' : ''">{{newsCategory.icon}}</md-icon>
          <span class="md-list-item-text">{{newsCategory.name}}</span>
        </md-list-item>
      </md-list>
      <!-- list in Drawer End -->
    </md-drawer>
    <!-- News Categories (Right Drawer) End -->
    
    <div class="md-layout-item md-size-95">
      <md-content class="md-layout md-gutter" style="background:#007998; padding: 1em;">
        <!-- v-for -->
        <ul v-for="headline in headlines" :key="headline.id" class="md-layout-item md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
          <md-card style="margin-top: 1em;" md-with-hover>
            <md-ripple>
            <md-card-media md-ratio="16:9">
              <img :src="headline.urlToImage" :alt="headline.title">
            </md-card-media>
            
            <md-card-header>
              <div class="md-title">
                <a :href="headline.url" target="_blank">
                  {{ headline.title }}
                </a>
              </div>
              <div>
                {{ headline.source.name }}
                <md-icon class="small-icon">book</md-icon>
              </div>
              
              <div class="md-subhead">
                  {{ headline.author}}
                  <md-icon class="small-icon">alarm</md-icon>
                </div>
            </md-card-header>
            
            <md-card-content>{{headline.description }}</md-card-content>
            <md-card-actions>
              <md-button class="md-icon-button">
                <md-icon>bookmark</md-icon>
              </md-button><md-button class="md-icon-button">
                <md-icon>message</md-icon>
              </md-button>
            </md-card-actions>
            </md-ripple>
          </md-card>
          <!-- <li>
            {{headline}}
          </li> -->
        </ul>
      </md-content>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      showRightSidePanel: false,
      showLeftSidePanel: false,
      newsCategories: [
        { name: 'トップヘッドライン', path: '', icon: 'today'},
        { name: 'テクノロジー', path: 'technology', icon: 'keyboard'},
        { name: 'ビジネス', path: 'business', icon: 'business_center'},
        { name: 'エンターテイメント', path: 'enterTainment', icon: 'weekend'},
        { name: 'ヘルス', path: 'health', icon: 'fastfood'},
        { name: 'サイエンス', path: 'science', icon: 'fingerprint'},
        { name: 'スポーツ', path: 'sports', icon: 'golf_course'}
      ]
    }
  },
  methods: {
    async loadCategory(category) {
      this.$store.commit('setCategory', category)
      await this.$store.dispatch('loadHeadlines',`/api/top-headlines?country=${this.country}&category=${this.category}`)
    },
    changeCountry(country) {
      this.$store.commit('setCountry', country)
    }
  },
  computed: {
    headlines() {
      return this.$store.getters.headlines
    },
    category() {
      return this.$store.getters.category
    },
    loading() {
      return this.$store.getters.loading
    },
    country () {
      return this.$store.getters.country
    },
    user() {
      return this.$store.getters.user
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  },
  // async asyncData({ app }) {
  //   const topHeadline = await app.$axios.$get('/api/top-headlines?country=jp')
  //   console.log(topHeadline)
  //   return {
  //     topHeadline: topHeadline.articles
  //   }
  // }
  async fetch({ store }) {
    await store.dispatch('loadHeadlines', `/api/top-headlines?country=${store.state.country}&category=${store.state.category}`)
  },
  watch: {
    async country() {
      await this.$store.dispatch('loadHeadlines', `/api/top-headlines?country=${this.country}&category=${this.category}`)
    }
  }
}
</script>

<style scoped>
  .small-icon {
    font-size: 18px !important;
  }
  .fixed-toolbar {
    position: fixed;
    top: 0;
    z-index: 5;
  }
</style>