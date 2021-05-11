<template>
  <div class="md-layout md-alignment-center-center" style="height: 100vh;">
    <md-card class="md-layout-item md-size-50">
      <md-card-header>
        <div class="md-title">登録</div>
      </md-card-header>
      <form @submit.prevent="validateForm">
        <md-card-content>
          <md-field md-clearable　:class="getValidationClass('email')">
            <label for="email">Email</label>
            <md-input :disabled="loading"  v-model="form.email" id="email" name="email" autocomplete="email" />
            <!-- Error Handling To Email -->
            <span class="md-error" v-if="!$v.form.email.required">Emailを入力して下さい</span>
            <span class="md-error" v-else-if="!$v.form.email.email">お使い頂けないEmailです</span>
          
          </md-field>
          <md-field :class="getValidationClass('password')">
            <label for="password">password</label>
            <md-input :disabled="loading" v-model="form.password" id="password" name="password" autocomplete="password" />
            <!-- Error Handling To Password -->
            <span class="md-error" v-if="!$v.form.password.required">パスワードを入力して下さい</span>
            <span class="md-error" v-else-if="!$v.form.password.minLength">パスワードが短いです</span>
            <span class="md-error" v-else-if="!$v.form.password.maxLength">長すぎるパスワードは使えません</span>
          </md-field>
        </md-card-content>
        <md-card-actions>
          <md-button @click="$router.push('/login')">ログイン</md-button>
          <md-button :disabled="loading" class="md-primary md-raised" type="submit">送信</md-button>
        </md-card-actions>
      </form>

      <md-snackbar :md-active.sync="isAuthenticated">{{form.email}}が登録されました</md-snackbar>
    </md-card>
    <md-button 
    class="md-fab md-fab-bottom-right md-fixed md-primary"
    @click="$router.go(-1)"
    >
    <md-icon>arrow_back</md-icon>
    </md-button>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  middleware: 'auth',
  mixins:[validationMixin],
  data() {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20)
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
    validateForm() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.registerUser()
      }
    },
    async registerUser() {
      await this.$store.dispatch('authenticateUser', {
          action:'register',
          email: this.form.email,
          password: this.form.password,
          returnSecureToken: true
      })
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName]
      if(field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    }
  }
}
</script>

<style>

</style>