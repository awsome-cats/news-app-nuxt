<template>
  <div>
    <p>Nuxt news</p>
    <ul v-for="headline in topHeadline" :key="headline.id">
      <li>{{headline}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  async asyncData({ app }) {
    const topHeadline = await app.$axios.$get('https://newsapi.org/v2/top-headlines?country=jp')
    console.log(topHeadline.articles)
    return {
      topHeadline: topHeadline.articles
    }
  }
}
</script>

<style>

</style>