<template>
    <div>
      <h1>Beta Readers</h1>
      <div>
        <v-text-field
          v-model="userName"
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
      <v-btn fab dark color="indigo"
        style="float: right"
        @click="addBetaReaders"
      >
        <v-icon dark>add</v-icon>
      </v-btn>
    </div>
</template>

<script>
export default {
  name: 'BetaReader',
  data: () => ({
    storyId: '',
    userName: '',
    usersTab: [],
    usersId: [],
    users: [],
    userList: [],
    betaReaders: []
  }),
  created () {
    this.storyId = this.$route.params.id

    let promises = []

    promises.push(this.$http.get(process.env.API_LOCATION + '/stories/' + this.storyId + '/betaReaders', {
      headers: {
        'Authorization': localStorage.accessToken
      },
      params: {
        'filter': {
          'include': 'user'
        }
      }
    }))

    promises.push(this.$http.get(process.env.API_LOCATION + '/users', {
      headers: {
        'Authorization': localStorage.accessToken
      }
    }))

    Promise.all(promises).then(values => {
      console.log(values)
      this.betaReaders = values[0].data
      let betaReaders = this.betaReaders.map(betaReader => betaReader.user)

      this.userList = values[1].data.filter(user => {
        if (user.id === parseInt(localStorage.userId)) return false

        for (let i = 0; i < betaReaders.length; i++) {
          if (betaReaders[i].id === user.id) {
            console.log('exists')
            return false
          }
        }
        return true
      })
    })
  },
  methods: {
    searchParamsChanged () {
      this.loadUsers()
    },
    loadUsers () {
      let userFilter = {
        'username': {
          'like': this.getUserNameForSearch()
        }
      }

      let whereArray = [userFilter]

      let requestParam = {
        headers: {
          'Authorization': localStorage.accessToken
        }
      }

      let filterParam = {
        params: {
          'filter': {
            'where': {'and': whereArray}
          }
        }
      }

      Object.assign(requestParam, filterParam)

      this.$http.get(process.env.API_LOCATION + '/users', requestParam)
        .then(res => {
          let usersTab = res.data
          let usersId = this.usersId
          let indexUser = ''
          let indexTab = []
          usersTab.forEach(function (user) {
            if (user.id === parseInt(localStorage.userId)) {
              indexUser = usersTab.indexOf(user)
              usersTab.splice(indexUser, 1)
            } else {
              let exist = usersId.includes(user.id)
              if (exist) {
                indexTab.push(usersTab.indexOf(user))
              }
            }
          })
          indexTab.sort((a, b) => b - a)
          indexTab.forEach(function (index) {
            usersTab.splice(index, 1)
          })
          this.usersTab = usersTab
        })
    },
    getUserNameForSearch () {
      let result = '%'
      Array.from(this.userName).forEach(char => {
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

      // let index = this.users.indexOf(user)
      // let idIndex = this.usersId.indexOf(user.userId)
      // this.usersId.splice(idIndex, 1)
      // this.users.splice(index, 1)
      // if (user.id >= 0) {
      //   this.$http.delete(process.env.API_LOCATION + '/beta_readers/' + user.id, {
      //     headers: {
      //       'Authorization': localStorage.accessToken
      //     }
      //   })
      // }
    },
    addBetaReaders () {
      let storyId = this.storyId
      let request = this.$http
      this.users.forEach(function (user) {
        if (user.id < 0) {
          request.post(process.env.API_LOCATION + '/beta_readers/', {
            header: {
              'Authorization': localStorage.accessToken
            },
            'userId': user.userId,
            'storyId': storyId
          })
            .then(res => {
              user.id = res.data.id
            })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
