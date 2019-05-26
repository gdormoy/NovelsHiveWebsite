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
      <v-list-tile @click="redirect">
        <v-list-tile-action><v-icon>dashboard</v-icon></v-list-tile-action>
        <v-list-tile-content><v-list-tile-title>Dashboard</v-list-tile-title>
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
      { title: 'Login', icon: 'question_answer', location: '/login' }
    ]
  }),
  computed: {
    drawer () {
      return this.$store.state.drawer
    }
  },
  methods: {
    toggleMiniDrawer () {
      this.drawer.mini = !this.drawer.mini
    },
    redirect () {
      // Redirect somewhere
    }
  }
}
</script>

<style scoped>

</style>
