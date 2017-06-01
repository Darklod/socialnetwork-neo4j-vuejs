import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import Profile from '@/components/Profile'
import Messages from '@/components/Messages'
import NotFound from '@/components/NotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        forAuth: true
      }
    }, {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        forVisitors: true
      }
    }, {
      path: '/signup',
      name: 'Signup',
      component: Signup,
      meta: {
        forVisitors: true
      }
    }, {
      path: '/messages/:username?',
      name: 'Messages',
      component: Messages,
      meta: {
        forAuth: true
      }
    }, {
      path: '/tags/:tag',
      name: 'Tags',
      component: Home,
      meta: {
        forAuth: true
      }
    }, {
      path: '/users/:username',
      name: 'Profile',
      component: Profile,
      meta: {
        forAuth: true
      }
    }, {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  linkActiveClass: 'is-active'
})
