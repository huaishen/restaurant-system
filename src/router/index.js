import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welocme from '../components/Welcome'
import UserList from '../components/user/UserList'
import Department from '../components/user/Department'
import Access from '../components/user/Access'
import DishList from '../components/dish/DishList'
import RawList from '../components/dish/RawList'
import OrderList from '../components/order/OrderList'
import '../assets/css/global_style.css'
import axios from 'axios'

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:5000/'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
// eslint-disable-next-line no-undef
axios.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token')
  return config
})

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welocme },
      { path: '/user/user_list', component: UserList },
      { path: '/user/department', component: Department },
      { path: '/user/access', component: Access },
      { path: '/dish/dish_list', component: DishList },
      { path: '/dish/raw_list', component: RawList },
      { path: '/order/order_list', component: OrderList }
    ]
  }
]

const router = new VueRouter({
  routes
})

/* Navigation guard */
router.beforeEach((to, from, next) => {
  const token = window.sessionStorage.getItem('token')
  if (to.path === '/login') {
    if (!token) return next()
    else return next('/home')
  }
  if (!token) return next('/login')
  return next()
})
export default router
