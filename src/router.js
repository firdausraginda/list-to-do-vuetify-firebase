import Vue from 'vue'
import Router from 'vue-router'
import Coba from './views/Coba.vue'
// import Login from './views/Login.vue'
import { auth } from './firebase/firebaseInit'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/coba',
      name: 'coba',
      component: Coba
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      // component: Login,
      component: () => import('./views/Login.vue')
    },
    {
      path: '/',
      component: () => import('./views/Home.vue'),
      redirect: '/dashboard',
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/todo',
          name: 'todo',
          component: () => import('./components/Todo.vue')
        },
        {
          path: '/doing',
          name: 'doing',
          component: () => import('./components/Doing.vue')
        },
        {
          path: '/done',
          name: 'done',
          component: () => import('./components/Done.vue')
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('./components/Dashboard.vue')
        },
        {
          path: '/account',
          name: 'account',
          component: () => import('./components/Account.vue')
        },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Check for requiredAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if NOT logged in
    if (!auth.currentUser) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  }
  else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (auth.currentUser) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  }
  else {
    next()
  }
})

export default router