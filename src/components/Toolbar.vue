<template>
  <v-toolbar
    app
    :clipped-left="toolbar.clippedLeft"
  >
    <v-toolbar-side-icon
      @click.stop="toggleDrawer"
    ></v-toolbar-side-icon>
    <v-toolbar-title>Vuetify Drawer Example</v-toolbar-title>
  </v-toolbar>
</template>

<script>
export default {
  computed: {
    toolbar () {
      return this.$store.state.toolbar
    },
    drawer () {
      return this.$store.state.drawer
    }
  },
  methods: {
    toggleDrawer () {
      this.drawer.open = !this.drawer.open
      this.drawer.permanent = !this.drawer.permanent
    }
  }
}
</script>

<style scoped>

</style>
