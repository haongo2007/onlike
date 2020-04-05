// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import VeeValidate from 'vee-validate';
import App from './App'
import router from './router'
import store from './store/store'
import VueCroppie from 'vue-croppie'
import 'croppie/croppie.css' // import the croppie css manually
import SuiVue from 'semantic-ui-vue'
import 'semantic-ui-css/semantic.css'
import Chat from 'vue-beautiful-chat'
// reference axios globally
window.axios = axios

// Global axios defaults
axios.defaults.baseURL = 'http://127.0.0.1:3333'

// register vee validate plugin
Vue.use(VeeValidate)
Vue.use(VueCroppie)
Vue.use(SuiVue)
Vue.use(Chat)

Vue.config.productionTip = false

// Global filter to format dates with momentjs
Vue.filter('timeAgo', date => moment(date).fromNow())
Vue.filter('joined', date => moment(date).format('MMMM YYYY'))
Vue.filter('dob', date => moment(date).format('MMMM Do YYYY'))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
