<template>
  <div id="register">
    <h1>Getting started</h1>

    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-alert
        :value="serverError"
        type="error"
        dismissible
      >
        {{serverDoesNotRespondErrorMessage}}
      </v-alert>

      <v-spacer />

      <v-text-field
        v-model="username"
        :counter="usernameMaxLength"
        :rules="usernameRules"
        label="Username"
        :error="usernameError"
        :error-messages="usernameErrorMessages"
        @input="usernameExists"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
        :type="passwordShow ? 'text' : 'password'"
        :rules="passwordRules"
        label="Password"
        required
        @click:append="passwordShow = !passwordShow"
      ></v-text-field>

      <v-text-field
        v-model="passwordConfirm"
        :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
        :type="passwordShow ? 'text' : 'password'"
        :rules="passwordConfirmRules"
        label="Password"
        required
        @click:append="passwordShow = !passwordShow"
      ></v-text-field>

      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        :error="emailError"
        :error-messages="emailErrorMessages"
        @input="emailExists"
        required
      ></v-text-field>

      <p>Already have an account ? <router-link to="/login">Log in</router-link></p>

      <v-btn
        :disabled="!valid"
        color="success"
        @click="validate"
      >
        Validate
      </v-btn>

      <v-btn
        color="error"
        @click="reset"
      >
        Reset Form
      </v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  data: () => ({
    serverError: false,
    valid: true,
    username: '',
    usernameMaxLength: 50,
    usernameRules: [
      v => !!v || 'Username is required',
      v => (v && v.length <= 50) || 'Username must be shorter than 50 characters',
      v => (v && v.length >= 3) || 'Username must be longer than 3 characters'
    ],
    usernameError: false,
    usernameErrorMessages: '',
    usernameSaved: '',
    password: '',
    passwordShow: false,
    passwordConfirm: '',
    passwordRules: [
      v => !!v || 'Password is required'
    ],
    passwordConfirmRules: [
      v => !!v || 'You must confirm your password'
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'Email must be valid'
    ],
    emailError: false,
    emailErrorMessages: '',
    emailSaved: '',
    serverDoesNotRespondErrorMessage: process.env.SERVER_DOES_NOT_RESPOND_ERROR_MESSAGE
  }),

  methods: {
    usernameExists () {
      if (this.$data.username !== this.$data.usernameSaved) {
        this.$data.usernameError = false
        this.$data.usernameErrorMessages = ''
      }
    },
    emailExists () {
      if (this.$data.email !== this.$data.emailSaved) {
        this.$data.emailError = false
        this.$data.emailErrorMessages = ''
      }
    },
    validate () {
      if (this.$refs.form.validate()) {
        let data = this.$data

        if (data.password === data.passwordConfirm) {
          this.$data.usernameSaved = this.$data.username
          this.$data.emailSaved = this.$data.email

          this.$http.post(process.env.API_LOCATION + '/users', {
            'email': data.email,
            'username': data.username,
            'password': data.password
          }).then(response => {
            // Redirect to validation page
            this.$router.push('/')
          }).catch(error => {
            if (error.response) {
              if (error.response.status === 422) {
                for (let message in error.response.data.error.details.messages) {
                  switch (message) {
                    case 'username':
                      this.$data.usernameError = true
                      this.$data.usernameErrorMessages = 'Username already exist'
                      break
                    case 'email':
                      this.$data.emailError = true
                      this.$data.emailErrorMessages = 'Username already exist'
                      break
                  }
                }
              } else {
                this.$data.serverError = true
              }
            } else {
              this.$data.serverError = true
            }
          })
        }
      }
    },
    reset () {
      this.$refs.form.reset()
    }
  }
}
</script>>

<style scoped>

</style>
