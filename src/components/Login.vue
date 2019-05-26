<template>
  <div id="login">

    <h1>Sign in</h1>
    <v-form
      ref="form"
      v-model="formIsValid"
      lazy-validation
    >
      <v-alert
        :value="loginError"
        type="error"
        dismissible
        style="width: 80%"
      >
        {{loginErrorMessage}}
      </v-alert>

      <v-text-field
        v-model="username"
        label="Username"
        :rules="usernameRules"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
        :type="passwordShow ? 'text' : 'password'"
        label="Password"
        required
        @click:append="passwordShow = !passwordShow"
      ></v-text-field>

      <p>Don't have an account yet ? You can <router-link to="/register">register</router-link></p>

      <v-btn
        :disabled="!formIsValid"
        color="success"
        @click="validate"
      >
        Log in
      </v-btn>
    </v-form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      formIsValid: false,
      loginError: false,
      loginErrorMessage: '',
      username: '',
      usernameRules: [
        v => !!v || 'Username is required'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required'
      ],
      passwordShow: false,
      serverDoesNotRespondErrorMessage: process.env.SERVER_DOES_NOT_RESPOND_ERROR_MESSAGE
    }
  },

  methods: {
    validate () {
      let requestBody = {
        'username': this.username,
        'password': this.password
      }

      this.$http.post(process.env.API_LOCATION + '/users/login', requestBody)
        .then(response => this.loginSuccessful(response))
        .catch(error => this.loginFailed(error))
    },
    loginSuccessful (response) {
      if (!response.data.id) {
        this.loginFailed(null)
        return
      }

      localStorage.accessToken = response.data.id
      console.log('login is a success, accesstoken : ' + response.data.id)
      // Redirect
      this.$router.push('/')
    },
    loginFailed (error) {
      this.loginError = true
      delete localStorage.accessToken

      if (!error.response) {
        this.loginErrorMessage = this.serverDoesNotRespondErrorMessage
        return
      }

      if (error.response.status === 401) {
        this.loginErrorMessage = 'Username/password pair is unknown. Did you create an account first ?\n' +
            'If you did, try to check your email box to find the validation email we sent you.'
      } else {
        this.loginErrorMessage = this.serverDoesNotRespondErrorMessage
      }
    }
  }
}
</script>

<style scoped>

</style>
