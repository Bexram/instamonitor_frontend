import Vue from 'vue'
import Vuex from 'vuex'

import Backend from '@/store/Backend'

Vue.use(Vuex)


export default new Vuex.Store({
  modules: {
    Backend
  },

})