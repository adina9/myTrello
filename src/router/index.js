import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Boards from '../views/Boards.vue'
import Board from '../views/Board.vue'
import EditCard from '../views/EditCard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/boards',
    component: Boards,
  },
  {
    path: '/boards/:boardId',
    component: Board,
    children: [{
      path: '/boards/:boardId/:cardId',
      component: EditCard,
      name: 'editCard',
    }]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
