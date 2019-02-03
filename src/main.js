import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import { auth } from './firebase/firebaseInit'
import './firebase/firebaseInit'

Vue.config.productionTip = false

// agar jika buka 2 window bisa sinkron login dan logout nya
let app;
auth.onAuthStateChanged(user => {
  if (!app){
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})