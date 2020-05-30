<template>
  <div class="md-layout md-alignment-center-center" style="height: 100vh;">
    <md-card class="md-layout-item md-size-50">
      <md-card-header>
        <div class="md-title">登録</div>
      </md-card-header>
      <form @submit.prevent="registerUser">
        <md-card-content>
          <md-field md-clearable>
            <label for="emai">Email</label>
            <md-input :disabled="loading" v-model="form.email" id="email" name="email" autocomplete="email" />
          </md-field>
          <md-field>
            <label for="password">password</label>
            <md-input ::disabled="loading" v-model="form.password" id="password" name="password" autocomplete="password" />
          </md-field>
        </md-card-content>
        <md-card-actions>
          <md-button :disabled="loading" class="md-primary md-raised" type="submit">送信</md-button>
        </md-card-actions>
      </form>

      <md-snackbar :md-active.sync="isAuthenticated">{{form.email}}が登録されました。</md-snackbar>
    </md-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  computed: {
    loading() {
      return this.$store.getters.loading
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  },
  watch: {
    isAuthenticated(value) {
      if(value) {
        setTimeout(() => {
          this.$router.push('/')
        }, 2000)
      }
    }
  },
  methods: {
    async registerUser() {
      await this.$store.dispatch('authenticateUser', {
          email: this.form.email,
          password: this.form.password,
          returnSecureToken: true
      })
    }
  }
}
</script>

<style>

</style>