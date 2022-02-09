import Vue from 'vue'
import Vuex from 'vuex'

import boardModule from './modules/board.module'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // boards:[

    // ]
  },
  // mutations: {
  // },
  // actions: {
  // },
  // modules: {
  // },
  modules: {
    boardModule
  }
})
