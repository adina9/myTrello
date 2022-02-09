import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/style/global.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Plugin } from 'vue-fragment'
// import moment from "moment";

// Vue.use(moment)
Vue.use(Plugin)

library.add(fas)
Vue.component('fa', FontAwesomeIcon)


Vue.config.productionTip = false


Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
})
Vue.directive('select', {
  inserted(el) {
    el.select()
  }
})

// Vue.directive('fragments', {
//   inserted: function (el) {
//     const children = Array.from(el.children)
//     const parent = el.parentElement
//     children.forEach((item) => { parent.appendChild(item) })
//     parent.removeChild(el)
//   }
// });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

