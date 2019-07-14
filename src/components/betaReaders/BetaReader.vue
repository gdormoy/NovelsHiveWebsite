<template>
    <div>
      <v-autocomplete
        v-model="username"
        :items="items"
        :search-input.sync="searchValue"
        label="Beta readers"
      ></v-autocomplete>
      <div
        v-for='user in betaReaders'
        :key='user.username'
        @click='deleteUser(user)'
        >
        {{user.username}}
      </div>
    </div>
</template>

<script>
export default {
  name: 'BetaReader',
  data: () => ({
    storyId: '',
    username: '',
    userList: [],
    searchMatchingUsers: [],
    betaReaders: [],
    searchValue: ''
  }),
  methods: {
    getUserNameForSearch (value) {
      return '%' + value + '%'
    },
    deleteUser (betaReader) {
      this.userList.push(betaReader)
      this.betaReaders.splice(this.betaReaders.indexOf(betaReader), 1)

      console.log('delete : ', betaReader, ' - ', this.betaReaders)
    },
    getUserByName (name) {
      for (let i = 0; i < this.userList.length; i++) {
        if (this.userList[i].username === name) {
          return this.userList[i]
        }
      }
    }
  },
  computed: {
    items () {
      return this.userList.map(user => user.username)
    }
  },
  watch: {
    username (val) {
      if (val === '' || val === undefined) return

      let user = this.getUserByName(val)
      this.betaReaders.push(user)
      this.userList.splice(this.userList.indexOf(user), 1)

      console.log('Update username : ', this.betaReaders)
    },
    searchValue (val) {
      val = val === null ? '' : val
      let filter = val.trim()

      this.$http.get(process.env.API_LOCATION + '/users', {
        headers: {
          'Authorization': localStorage.accessToken
        },
        params: {
          filter: {
            where: {
              username: {
                like: this.getUserNameForSearch(filter)
              }
            }
          }
        }
      }).then(response => {
        let betaReaders = this.betaReaders

        this.userList = response.data.filter(user => {
          if (user.id === parseInt(localStorage.userId)) return false

          for (let i = 0; i < betaReaders.length; i++) {
            if (betaReaders[i].id === user.id) {
              return false
            }
          }
          return true
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
