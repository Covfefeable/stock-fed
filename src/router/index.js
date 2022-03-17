import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      alive: true
    },
    component: () => import('../views/Home.vue')
  },
  {
    path: '/model',
    name: 'Model',
    meta: {
      alive: false
    },
    component: () => import('../views/Model.vue')
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      alive: false
    },
    component: () => import('../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
