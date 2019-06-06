<template>
  <div id="account">
    <h1>My Account</h1>
    <div id="account-content">
      <v-form
        ref="form"
        v-model="formIsValid"
        lazy-validation
      >
        <v-flex xs12 sm6 md3 class="body-1">
          <v-text-field
          v-if="changeUsername"
          v-model="username"
          :counter="usernameMaxLength"
          label="Username"
          :error="usernameError"
          :error-messages="usernameErrorMessages"
          @input="usernameExists"
          required
        ></v-text-field>
          <div v-else>
            Username: {{user.username}}
            <v-btn fab large color="white" @click="changeUsernameMethode">
              <v-icon dark>edit</v-icon>
            </v-btn>
          </div>
        </v-flex>
        <v-flex xs4 order-md3 order-xs2 class="body-1">
          <v-text-field
            v-if="changeEmail"
            v-model="email"
            label="E-mail"
            :error="emailError"
            :error-messages="emailErrorMessages"
            @input="emailExists"
            required
          ></v-text-field>
          <div v-else>
            Email: {{user.email}}
            <v-btn fab large color="white" @click="changeEmailMethode">
              <v-icon dark>edit</v-icon>
            </v-btn>
          </div>
        </v-flex>
        <v-flex xs4 order-md3 order-xs2 class="body-1">
          <div v-if="changePassword">
            <v-text-field
            v-model="password"
            :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
            :type="passwordShow ? 'text' : 'password'"
            label="Password"
            required
            @click:append="passwordShow = !passwordShow"
            ></v-text-field>
            <v-text-field
            v-model="newPassword"
            :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
            :type="passwordShow ? 'text' : 'password'"
            label="New Password"
            required
            @click:append="passwordShow = !passwordShow"
            ></v-text-field>
            <v-text-field
            v-model="passwordConfirm"
            :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
            :type="passwordShow ? 'text' : 'password'"
            label="Confirm New Password"
            required
            @click:append="passwordShow = !passwordShow"
            ></v-text-field>
          </div>
          <div v-else>
            Password:
            <v-btn fab large color="white" @click="changePasswordMethode">
              <v-icon dark>edit</v-icon>
            </v-btn>
          </div>
        </v-flex>
        <v-flex xs4 order-md3 order-xs2 class="body-1">
          <v-textarea
            v-if="changeDescription"
            name="input-7-1"
            label="Description"
            :value="user.description"
            v-model="description"
            hint="Hint text"
          ></v-textarea>
          <div v-else>
            Description: {{user.description}}
            <v-btn fab large color="white" @click="changeDescriptionMethode">
              <v-icon dark>edit</v-icon>
            </v-btn>
          </div>
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
      color="error"
      @click="reset"
    >
      Reset Form
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data: () => {
    return {
      userError: false,
      userErrorMessage: '',
      user: '',
      email: '',
      emailSaved: '',
      password: '',
      changePassword: false,
      newPassword: '',
      description: '',
      passwordConfirm: '',
      passwordShow: false,
      formIsValid: false,
      changeUsername: false,
      changeEmail: false,
      changeDescription: false,
      serverDoesNotRespondErrorMessage: process.env.SERVER_DOES_NOT_RESPOND_ERROR_MESSAGE,
      username: '',
      usernameError: false,
      usernameErrorMessages: '',
      usernameSaved: '',
      usernameMaxLength: 50
    }
  },
  mounted () {
    this.$http.get(process.env.API_LOCATION + '/users/' + localStorage.userId, {
      headers: {
        'X-Access-Token': localStorage.accessToken
      }
    })
      .then(response => (this.user = response.data))
      .then(response => (this.user.description = Buffer.from(this.user.description.data).toString('ascii')))
      .then(response => (this.description = this.user.description))
      .catch(error => this.getUserFailed(error))
  },
  methods: {
    getUserFailed (error) {
      this.userError = true
      delete localStorage.accessToken

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
    changeUsernameMethode () {
      this.changeUsername = true
    },
    changeEmailMethode () {
      this.changeEmail = true
    },
    changeDescriptionMethode () {
      this.changeDescription = true
    },
    changePasswordMethode () {
      this.changePassword = true
    },
    validate () {
      if (this.$refs.form.validate()) {
        console.log(this.username, this.email, this.description, this.password)
        console.log(this.newPassword)
        console.log(localStorage.accessToken)
        console.log(localStorage.userId)

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
        if (this.changeUsername) {
          this.$http.patch(process.env.API_LOCATION + '/users/' + localStorage.userId, {
            'username': this.username
          },
          {
            headers: {
              'X-Access-Token': localStorage.accessToken
            }
          }).catch(error => {
            if (error.response) {
              this.$data.serverError = true
            }
          })
          this.changeUsername = false
        }
        if (this.changeEmail) {
          this.$http.patch(process.env.API_LOCATION + '/users/' + localStorage.userId, {
            'email': this.email
          },
          {
            headers: {
              'X-Access-Token': localStorage.accessToken
            }
          }).catch(error => {
            if (error.response) {
              this.$data.serverError = true
            }
          })
          this.changeEmail = false
        }
        if (this.changeDescription) {
          this.$http.patch(process.env.API_LOCATION + '/users/' + localStorage.userId, {
            'description': this.description
          },
          {
            headers: {
              'X-Access-Token': localStorage.accessToken
            }
          }).catch(error => {
            if (error.response) {
              this.$data.serverError = true
            }
          })
          this.changeDescription = false
        }
      }
      window.location.reload()
    },
    reset () {
      this.$refs.form.reset()
    }
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
    font-size: 2em;
  }

</style>
