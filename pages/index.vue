<template>
  <div class="md-layout md-alignment-center">
    <div class="md-layout-item md-size-95">
      <md-content class="md-layout md-gutter" style="background:#007998; padding: 1em;">
        <!-- v-for -->
        <ul v-for="headline in topHeadline" :key="headline.id" class="md-layout-item md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
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
  async asyncData({ app }) {
    const topHeadline = await app.$axios.$get('/api/top-headlines?country=jp')
    // console.log(topHeadline.articles)
    return {
      topHeadline: topHeadline.articles
    }
  }
}
</script>

<style scoped>
  .small-icon {
    font-size: 18px !important;
  }
</style>