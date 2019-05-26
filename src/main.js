// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import SimpleLineIcon from 'vue-simple-line'
import NavigationDrawer from './components/NavigationDrawer'
import Toolbar from './components/Toolbar'
import store from './store'

Vue.config.productionTip = false
Vue.use(Vuetify, VueRouter, VueAxios, axios)
Vue.prototype.$http = axios

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  axios,
  store,
  components: { App, NavigationDrawer, Toolbar, SimpleLineIcon },
  template: '<App/>'
})
