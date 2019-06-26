<template>
  <div id="app">
    <navigation-drawer />
    <toolbar />
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center column>
          <v-flex shrink>
            <router-view/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <loader></loader>
  </div>
</template>

<script>
import NavigationDrawer from './components/NavigationDrawer'
import Toolbar from './components/Toolbar'
import Loader from './components/Loader'

export default {
  name: 'App',
  components: {Toolbar, NavigationDrawer, Loader}
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
