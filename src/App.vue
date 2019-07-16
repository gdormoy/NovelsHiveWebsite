<template>
  <v-app>
    <div id="app">
      <navigation-drawer />
      <toolbar />
      <v-content style="width: 90%; margin-left: auto; margin-right: auto; margin-top: -5%;" >
        <v-container fluid fill-height>
          <v-layout justify-center column>
            <v-flex shrink>
              <router-view :key="$route.fullPath"/>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>

      <loader></loader>
    </div>
  </v-app>
</template>

<script>
import NavigationDrawer from './components/utils/NavigationDrawer'
import Toolbar from './components/utils/Toolbar'
import Loader from './components/utils/Loader'

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

  blockquote
  {
    font-style: normal;
    font-size: 16px;
    margin-left: 32px;
    font-family: Consolas, "Times New Roman", Verdana, serif;
    border-left: 4px solid #CCC;
    padding-left: 8px;
    font-style: italic;
  }
</style>
