import Vue from 'vue'
import Vuex, {Payload, Store} from 'vuex'
//import VuexPersistence from 'vuex-persist'
//import Cookies from 'js-cookie'


Vue.use(Vuex)

import getters from './getters'
import mutations from './mutations'
import actions from './actions'

/*const vuexSession = new VuexPersistence({
  storage: window.sessionStorage
})*/

const store = new Vuex.Store({
    state: {
        checkLogin: localStorage.getItem('tweetr-token') ? localStorage.getItem('tweetr-token') : null,
        chat: null,
        authUser: {},
        user: {},
        tweets: [],
    },
    //plugins: [vuexSession.plugin,],
    getters,
    mutations,
    actions
})

export default store