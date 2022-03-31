import Vue from 'vue'
import VueRouter from 'vue-router'
import File from '@/views/file'

Vue.use(VueRouter)

const routes = [{ path: '/', component: File }]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
