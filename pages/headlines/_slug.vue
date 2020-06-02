<template>
  <div class="md-layout md-alignment-center" style="margin: 5em 0;">
    <div class="md-layout-item md-size-75 md-small-size-80 md-xsmall-size-100">
      <md-card >
        <md-card-media style="height: 300px;" md-ratio="16:9">
          <img :src="headline.urlToImage" :alt="headline.title"/>
        </md-card-media>
        <md-card-header>
          <div class="md-title">
            <a :href="headline.url" target="_blank">{{headline.title}}</a>
          </div>
          <div>
            {{headline.source.name}}
            <md-icon>book</md-icon>
          </div>
          <span class="md-subhead" v-if="headline.author">
            {{headline.author}}
            <md-icon>face</md-icon>
          </span>
        </md-card-header>
        <md-card-content>{{headline.content}}</md-card-content>
      </md-card>
    
    <!-- comment form -->
    <form @submit.prevent="sendComment" >
      <md-field>
        <label>コメントを書いてみましょう</label>
        <!-- Not User & loading is true -->
        <md-textarea v-model="text" :disabled="loading || !user">
          <md-icon>description</md-icon>
        </md-textarea>
      </md-field>
      <md-button class="md-primary md-raised" type="submit" :disabled="loading || !user">コメントを送信する</md-button>
    </form>

    <!-- comments -->
    <md-list class="md-triple-line" style="margin-top: 1em;">
      <md-list-item v-for="comment in headline.comments" :key="comment.id">
        <md-avatar>
          <img :src="comment.user.avatar" :alt="comment.user.username" />
        </md-avatar>
        <div class="md-list-item-text">
          <span>{{ comment.user.username }}</span>
          <span>{{ comment.publishedAt }}</span>
          <p>{{ comment.text }}</p>
        </div>

        <md-badge class="md-primary" md-position="bottom"
        :md-content="comment.likes"
        />
          <md-button @click="likeComment(comment.id)" class="md-icon-button" :disabled="loading || !user">
            <md-icon>thumb_up</md-icon>
          </md-button>
        
      </md-list-item>
    </md-list>
    <!-- back button -->
    <md-button 
    class="md-fab md-fab-bottom-right md-fixed md-primary"
    @click="$router.go(-1)"
    >
    <md-icon>arrow_back</md-icon>
    </md-button>
  </div>
  </div>
</template>

<script>
import {uuid} from 'uuidv4'
export default {
  data() {
    return {
      text: ''
    }
  },
  async fetch({ store, params }) {
    await store.dispatch('loadHeadline', params.slug)
  },
  methods: {
     async sendComment() {

      console.log('sendComment')
      const comment = {
        id: uuid(),
        text: this.text,
        user: this.getCommentUserData(),
        publishedAt: Date.now(),
        likes: 0
      }
      console.log('comment', comment)
      await this.$store.dispatch('sendComment', comment)
      this.text = ''
    },
    getCommentUserData() {
      const commentUserData = { ...this.user};
      // console.log('commentUserData',commentUserData)
      // userからusernameを作成
      commentUserData['username'] = commentUserData['email'].split('@')[0]
      console.log('commentUserData2',commentUserData)
      return commentUserData
    },
    async likeComment(commentId) {
      await this.$store.dispatch('likeComment', commentId)
    }
  },
  computed: {
    headline() {
      return this.$store.getters.headline
    },
    loading() {
      return this.$store.getters.loading
    },
    user() {
      return this.$store.getters.user
    }
  }
}
</script>

<style>

</style>