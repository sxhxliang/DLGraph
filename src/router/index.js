import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Studio from '@/page/studio'
import Code from '@/page/code'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: Studio
    },
    {
      path: '/studio',
      name: 'Studio',
      component: Studio
    },
    {
      path: '/code',
      name: 'Code',
      component: Code
    }
  ]
})
