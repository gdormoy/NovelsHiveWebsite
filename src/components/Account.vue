<template>
  <div id="account">
    <h1>My Account</h1>
    <div id="account-content">
      <div>
        Username: {{user.data.username}}
      </div>
      <div>
        Email: {{user.data.email}}
      </div>
      <v-form
        ref="form"
        v-model="formIsValid"
        lazy-validation
      >
        <div>
          Password:
          <v-text-field
            v-model="password"
            :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
            :type="passwordShow ? 'text' : 'password'"
            label="Password"
            required
            @click:append="passwordShow = !passwordShow"
          ></v-text-field>
        </div>
        <div>
          New Password:
          <v-text-field
          v-model="newPassword"
          :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
          :type="passwordShow ? 'text' : 'password'"
          label="Password"
          required
          @click:append="passwordShow = !passwordShow"
          ></v-text-field>
        </div>
        <div>
          Confirm Password
          <v-text-field
          v-model="passwordConfirm"
          :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
          :type="passwordShow ? 'text' : 'password'"
          label="Password"
          required
          @click:append="passwordShow = !passwordShow"
          ></v-text-field>
        </div>
      </v-form>
      <div>
        Description: {{user.data.description}}
      </div>
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
      username: '',
      email: '',
      password: '',
      newPassword: '',
      description: '',
      passwordConfirm: '',
      passwordShow: false,
      formIsValid: false,
      serverDoesNotRespondErrorMessage: process.env.SERVER_DOES_NOT_RESPOND_ERROR_MESSAGE
    }
  },
  mounted () {
    this.$http.get(process.env.API_LOCATION + '/users/' + localStorage.userId, {
      headers: {
        'X-Access-Token': localStorage.accessToken
      }
    })
      .then()
      .then(response => (this.user = response))
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
    validate () {
      if (this.$refs.form.validate()) {
        let data = this.$data
        this.$data.desctiptionSaved = this.$data.description

        console.log(data.username, data.email, data.description)
        console.log(localStorage.accessToken)

        if (data.password !== '') {
          this.$http.put(process.env.API_LOCATION + '/users/' + localStorage.userId, {
            'username': this.user.data.username,
            'email': this.user.data.email,
            'password': data.password,
            'description': this.user.data.description
          },
          {
            headers: {
              'X-Access-Token': localStorage.accessToken
            }
          }).then(response => {
            // Redirect to validation page
            this.$router.push('/')
          }).catch(error => {
            if (error.response) {
              this.$data.serverError = true
            }
          })
          if (data.newPassword !== '') {
            if (data.newPassword === data.passwordConfirm) {
              this.$http.post(process.env.API_LOCATION + '/users/change-password', {
                oldPassword: data.password,
                newPassword: data.newPassword
              },
              {
                headers: {
                  'X-Access-Token': localStorage.accessToken
                }
              })
            }
          }
        }
      }
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
