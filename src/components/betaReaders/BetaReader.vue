<template>
    <div>
      <h1>Beta Readers</h1>
      <div>
        <v-text-field
          v-model="username"
          placeholder="Users"
          prepend-inner-icon="search"
          clearable
          @input="searchParamsChanged"
        ></v-text-field>
      </div>
      <v-list>
        <v-list-tile
          v-for='user in userList'
          :key='user.username'
          @click='addUser(user)'
        >
          <v-list-tile-content>
            <v-list-tile-title v-text="user.username"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-tab
        v-for='user in betaReaders'
        :key='user.username'
        @click='deleteUser(user)'
        style="font-size: 1.5em"
        >
        {{user.user.username}}
      </v-tab>
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
    betaReaders: []
  }),
  created () {
    this.storyId = this.$route.params.id

    let promises = [
      this.$http.get(process.env.API_LOCATION + '/stories/' + this.storyId + '/betaReaders', {
        params: {
          'filter': {
            'include': 'user'
          }
        }
      }),
      this.getUsers()
    ]

    Promise.all(promises).then(values => {
      this.betaReaders = values[0].data
      this.getBetaReadersUsersCandidates(values[1].data)
    })
  },
  methods: {
    getUsers () {
      return this.$http.get(process.env.API_LOCATION + '/users', {
        headers: {
          'Authorization': localStorage.accessToken
        },
        params: {
          filter: {
            where: {
              username: {
                like: this.getUserNameForSearch()
              }
            }
          }
        }
      })
    },
    getBetaReadersUsersCandidates (allUsers) {
      let betaReaders = this.betaReaders.map(betaReader => betaReader.user)

      this.userList = allUsers.filter(user => {
        if (user.id === parseInt(localStorage.userId)) return false

        for (let i = 0; i < betaReaders.length; i++) {
          if (betaReaders[i].id === user.id) {
            return false
          }
        }
        return true
      })
    },
    searchParamsChanged () {
      console.log('searchParamsChanged')
      this.getUsers().then(response => {
        console.log(response)
        this.getBetaReadersUsersCandidates(response.data)
      })
    },
    getUserNameForSearch () {
      let result = '%'
      Array.from(this.username).forEach(char => {
        result += char
      })
      result += '%'

      return result
    },
    addUser (user) {
      this.userList.splice(this.userList.indexOf(user), 1)

      this.$http.post(process.env.API_LOCATION + '/beta_readers', {
        'userId': user.id,
        'storyId': this.storyId
      }).then(response => this.betaReaders.push(response.data))
        .catch(error => console.log(error))
    },
    deleteUser (betaReader) {
      this.userList.push(betaReader.user)
      this.betaReaders.splice(this.betaReaders.indexOf(betaReader), 1)

      this.$http.delete(process.env.API_LOCATION + /beta_readers/ + betaReader.id)
        .then(response => console.log(response))
        .catch(error => console.log(error))
    }
  }
}
</script>

<style scoped>

</style>
