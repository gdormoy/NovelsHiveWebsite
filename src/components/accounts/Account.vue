<template>
  <div id="account">
    <h1>My Account</h1>
    <div id="account-content">
      <v-form
        ref="form"
        v-model="formIsValid"
        lazy-validation
      >
        <v-alert
          id="accountAlert"
          :value="userError"
          type="error"
          dismissible
          style="width: 80%"
        >{{userErrorMessages}}</v-alert>

        <v-flex xs12 sm6 md3 class="body-1">
          <v-text-field
          v-model="username"
          :rules="usernameRules"
          :counter="usernameMaxLength"
          label="Username"
          :error="usernameError"
          :error-messages="usernameErrorMessages"
          @input="usernameExists"
          required
        ></v-text-field>
        </v-flex>
        <v-flex xs4 order-md3 order-xs2 class="body-1">
          <v-text-field
            v-model="email"
            label="E-mail"
            :error="emailError"
            :error-messages="emailErrorMessages"
            @input="emailExists"
            required
          ></v-text-field>
        </v-flex>
        <v-flex xs4 order-md3 order-xs2 class="body-1">
          <div v-if="changePassword" style="font-size: 1em">
            <v-text-field
            v-model="password"
            :rules="passwordRules"
            :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
            :type="passwordShow ? 'text' : 'password'"
            label="Password"
            required
            @click:append="passwordShow = !passwordShow"
            ></v-text-field>
            <v-text-field
            v-model="newPassword"
            :rules="newPasswordRules"
            :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
            :type="passwordShow ? 'text' : 'password'"
            label="New Password"
            required
            @click:append="passwordShow = !passwordShow"
            ></v-text-field>
            <v-text-field
            v-model="passwordConfirm"
            :rules="newPasswordConfirmRules"
            :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
            :type="passwordShow ? 'text' : 'password'"
            label="Confirm New Password"
            required
            @click:append="passwordShow = !passwordShow"
            ></v-text-field>
          </div>
          <div v-else>
            Password:
            <v-btn fab small color="white" @click="changePasswordMethode">
              <v-icon dark>edit</v-icon>
            </v-btn>
          </div>
        </v-flex>
        <v-flex xs4 order-md3 order-xs2 class="body-1">
          <v-textarea
            name="input-7-1"
            label="Description"
            :value="user.description"
            v-model="description"
            hint="Hint text"
          ></v-textarea>
        </v-flex>
      </v-form>
    </div>
    <v-btn
      :disabled="!formIsValid"
      color="success"
      @click="validate"
    >
      Validate
    </v-btn>
    <v-btn
      color="blue-grey"
      class="white--text"
      @click="getInformations"
    >
      Send Informations
      <v-icon right dark>email</v-icon>
    </v-btn>
    <v-btn
      color="red"
      class="white--text"
      @click="deleteUser"
    >
      Delete
      <v-icon right dark>delete</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data: () => (
    {
      userError: false,
      userErrorMessages: '',
      user: '',
      email: '',
      emailErrorMessages: '',
      emailSaved: '',
      emailError: false,
      password: '',
      changePassword: false,
      newPassword: '',
      description: '',
      passwordConfirm: '',
      passwordShow: false,
      formIsValid: false,
      serverDoesNotRespondErrorMessage: process.env.SERVER_DOES_NOT_RESPOND_ERROR_MESSAGE,
      username: '',
      usernameError: false,
      usernameErrorMessages: '',
      usernameSaved: '',
      usernameMaxLength: 50,
      usernameRules: [
        v => !!v || 'Username is required',
        v => (v && v.length <= 50) || 'Username must be shorter than 50 characters',
        v => (v && v.length >= 3) || 'Username must be longer than 3 characters'
      ],
      passwordRules: [
        v => !!v || 'Password is required'
      ],
      newPasswordRules: [
        v => !!v || 'Password is required'
      ],
      newPasswordConfirmRules: [
        v => !!v || 'You must confirm your password'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ]
    }
  ),
  created () {
    this.$http.get(process.env.API_LOCATION + '/users/' + localStorage.userId, {
      headers: {
        'X-Access-Token': localStorage.accessToken
      }
    }).then(response => {
      let data = response.data
      this.username = data.username
      this.email = data.email
      this.description = Buffer.from(data.description.data).toString('ascii')
    }).catch(error => this.getUserFailed(error))
  },
  methods: {
    getUserFailed (error) {
      console.log(error)

      this.userError = true
      if (!error.response) {
        this.userErrorMessage = this.serverDoesNotRespondErrorMessage
        return
      }

      if (error.response.status === 401) {
        this.userErrorMessage = 'unautorized to display this profile'
      } else {
        this.userErrorMessage = this.serverDoesNotRespondErrorMessage
      }
    },
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
    changePasswordMethode () {
      this.changePassword = true
    },
    validate () {
      if (this.$refs.form.validate()) {
        if (this.changePassword) {
          if (this.newPassword !== '') {
            if (this.newPassword === this.passwordConfirm) {
              this.$http.post(process.env.API_LOCATION + '/users/change-password', {
                oldPassword: this.password,
                newPassword: this.newPassword
              },
              {
                headers: {
                  'X-Access-Token': localStorage.accessToken
                }
              })
            }
          }
          this.changePassword = false
        }
        this.$http.patch(process.env.API_LOCATION + '/users/' + localStorage.userId, {
          'username': this.username,
          'email': this.email,
          'description': this.description
        },
        {
          headers: {
            'X-Access-Token': localStorage.accessToken
          }
        }).catch(error => {
          console.log(error)
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
          }
        })
      }
    },
    getInformations () {
      this.$http.get(process.env.API_LOCATION + '/users/' + localStorage.userId + '/gdpr', {
        headers: {
          'X-Access-Token': localStorage.accessToken
        }
      })
        .then(response => (console.log(response)))
        .catch(error => (this.getUserFailed(error)))
    },
    deleteUser () {
    //   this.$http.delete(process.env.API_LOCATION + '/users/' + localStorage.userId, {
    //     headers: {
    //       'X-Access-Token': localStorage.accessToken
    //     }
    //   })
    //     .then(response => (console.log(response)))
    // }
      console.log('under construction')
  }
}
</script>

<style scoped>
  #account-content {
    text-align: left;
    margin-top: 25px;
    margin-left: 50px;
  }
  #account-content div {
    margin-top: 25px;
  }

</style>
