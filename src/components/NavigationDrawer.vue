<template>
  <v-navigation-drawer
    :clipped="drawer.clipped"
    :permanent="drawer.permanent"
    :mini-variant="drawer.mini"
    v-model="drawer.open"
    app
  >
    <v-list>
      <v-list-tile @click="toggleMiniDrawer">
        <v-list-tile-action><v-icon>aspect_ratio</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>Mini Drawer</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        v-for="item in items"
        :key="item.title"
        @click="redirect(item.location)"
      >
        <v-list-tile-action><v-icon>{{item.icon}}</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>{{item.title}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-divider></v-divider>

      <v-list-tile v-if="userIsLogged" @click="signOut">
        <v-list-tile-action><v-icon>exit_to_app</v-icon></v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Sign out</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-else @click="redirect('/login')">
        <v-list-tile-action><v-icon>exit_to_app</v-icon></v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Sign in</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    items: [
      { title: 'Home', icon: 'home', location: '/' },
      { title: 'Account', icon: 'account_circle', location: '/account' }
    ]
  }),
  computed: {
    drawer () {
      return this.$store.state.drawer
    },
    userIsLogged () {
      return !!localStorage.accessToken
    }
  },
  methods: {
    toggleMiniDrawer () {
      this.drawer.mini = !this.drawer.mini
    },
    redirect (location) {
      // Redirect somewhere
      this.$router.push(location)
    },
    signOut () {
      delete localStorage.accessToken
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
