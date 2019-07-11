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
          :key='user.userName'
          @click='addUser(user)'
        >
          <v-list-tile-content>
            <v-list-tile-title v-text="user.username"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-tab
        v-for='name in users'
        :key='name'
        @click='deleteUser(name)'
        >
        {{name}}
      </v-tab>
      <v-btn
        style="float: right"
        @click="addBetaReaders"
      >
        Add beta lecteur
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
            'where': {'and': whereArray},
            'limit': 20,
            'skip': 0
          }
        }
      }

      Object.assign(requestParam, filterParam)

      this.$http.get(process.env.API_LOCATION + '/users', requestParam)
        .then(res => {
          let exist = ''
          let usersId = this.usersId
          this.usersTab = res.data
          let usersTab = this.usersTab
          usersTab.forEach(function (user) {
            let index = usersTab.indexOf(user)
            exist = usersId.includes(user.id)
            if (exist) {
              usersTab.splice(index, 1)
            }
          })
          this.usersTab = usersTab
        })
    },
    getUserNameForSearch () {
      let result = '%'
      Array.from(this.userName).forEach(char => {
        result += char + '%'
      })

      return result
    },
    addUser (user) {
      let index = this.usersTab.indexOf(user)
      this.users.push(user.username)
      this.usersId.push(user.id)
      this.usersTab.splice(index, 1)
    },
    deleteUser (user) {
      let index = this.users.indexOf(user.username)
      let idIndex = this.usersId.indexOf(user.id)
      this.usersId.splice(idIndex, 1)
      this.users.splice(index, 1)
    },
    addBetaReaders () {
      let storyId = this.storyId
      let request = this.$http
      this.usersId.forEach(function (id) {
        request.post(process.env.API_LOCATION + '/beta_readers/', {
          header: {
            'Authorization': localStorage.accessToken
          },
          'userId': id,
          'storyId': storyId
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
