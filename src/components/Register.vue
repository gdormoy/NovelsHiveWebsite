<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="username"
      :counter="usernameMaxLength"
      :rules="usernameRules"
      label="Username"
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
      :append-icon="passwordConfirmShow ? 'visibility' : 'visibility_off'"
      :type="passwordConfirmShow ? 'text' : 'password'"
      :rules="passwordConfirmRules"
      label="Password"
      required
      @click:append="passwordConfirmShow = !passwordConfirmShow"
    ></v-text-field>

    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>

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

    <v-btn
      color="warning"
      @click="resetValidation"
    >
      Reset Validation
    </v-btn>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    username: '',
    usernameMaxLength: 50,
    usernameRules: [
      v => !!v || 'Username is required',
      v => (v && v.length <= 50) || 'Username must be shorter than 50 characters',
      v => (v && v.length >= 3) || 'Username must be longer than 3 characters'
    ],
    password: '',
    passwordShow: false,
    passwordConfirm: '',
    passwordConfirmShow: false,
    passwordRules: [
      v => !!v || 'Password is required'
    ],
    passwordConfirmRules: [
      v => !!v || 'You must confirm your password'
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ]
  }),

  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        let data = this.$data

        if (data.password === data.passwordConfirm) {
          console.log('Call API for login')
        }
      }
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    }
  }
}
</script>

<style scoped>

</style>
