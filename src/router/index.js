import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import '../assets/css/global_style.css'
import axios from 'axios'

Vue.prototype.$http = axios
axios.defaults.baseURL = ' http://127.0.0.1:5000/'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

/* Navigation guard */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('access_token')
  if (!token) return next('/login')
  return next()
})
export default router
