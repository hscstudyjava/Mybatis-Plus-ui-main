import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
// @ts-ignore
import login from '@/views/login.vue';
// @ts-ignore
import Layout from '@/layout/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/system',
      name: 'system',
      component: Layout,
      redirect: '/system/user',
      meta: { title: '系统管理', icon: 'dashboard' },
      children: [{
        path: 'user',
        name: 'user',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户信息', icon: 'dashboard' }
      }]
    },
    {
      path: '/',
      name: 'home',
      component: Layout,
      redirect: '/dashboard',
      children: [{
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'dashboard' }
      }]
    }
  ]
})

export default router
