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
          v-for='user in usersTab'
          :key='user.username'
          @click='addUser(user)'
        >
          <v-list-tile-content>
            <v-list-tile-title v-text="user.username"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-tab
        v-for='user in users'
        :key='user.username'
        @click='deleteUser(user)'
        style="font-size: 1.5em"
        >
        {{user.username}}
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
    users: []
  }),
  created () {
    this.storyId = this.$route.params.id

    let requestParam = {
      headers: {
        'Authorization': localStorage.accessToken
      }
    }

    let filterParam = {
      params: {
        'filter': {
          'include': 'user'
        }
      }
    }

    Object.assign(requestParam, filterParam)

    this.$http.get(process.env.API_LOCATION + '/stories/' + this.storyId + '/betaReaders', requestParam)
      .then(res => {
        let data = res.data
        let readers = []
        let readersId = []
        data.forEach(function (reader) {
          let user = {
            id: reader.id,
            userId: reader.user.id,
            username: reader.user.username
          }
          readers.push(user)
          readersId.push(reader.user.id)
        })
        this.usersId = readersId
        this.users = readers
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
      let index = this.usersTab.indexOf(user)
      console.log(index)
      let element = {
        id: -1,
        userId: user.id,
        username: user.username
      }
      this.users.push(element)
      this.usersId.push(user.id)
      this.usersTab.splice(index, 1)
    },
    deleteUser (user) {
      let index = this.users.indexOf(user)
      let idIndex = this.usersId.indexOf(user.userId)
      this.usersId.splice(idIndex, 1)
      this.users.splice(index, 1)
      if (user.id >= 0) {
        this.$http.delete(process.env.API_LOCATION + '/beta_readers/' + user.id, {
          headers: {
            'Authorization': localStorage.accessToken
          }
        })
      }
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
