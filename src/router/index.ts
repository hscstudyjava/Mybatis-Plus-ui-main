import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
// @ts-ignore
import login from '@/views/login.vue';
// @ts-ignore
import Layout from '@/layout/index.vue'
// @ts-ignore
import ParentView from '@/components/ParentView/index.vue'
// @ts-ignore
import error from '@/views/error/index.vue'
// @ts-ignore
import NotFound from '@/views/error/NotFound/index.vue';
import type { AppRouteRecordRaw, Menu } from '@/types/menu';
import { shallowRef } from 'vue';

// 默认路由,静态路由
export const defaultRouter: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/error',
    name: 'error',
    // component: shallowRef(ParentView),
    hidden: true,
    redirect: '/error/404',
    children: [
      {
        path: 'network',
        name: 'network',
        // @ts-ignore
        component: () => import('@/views/error/Network/index.vue')
      },
      {
        path: '404',
        name: '404',
        // @ts-ignore
        component: () => import('@/views/error/NotFound/index.vue'),
      },
      {
        path: '403',
        name: '403',
        // @ts-ignore
        component: () => import('@/views/error/Authorization/index.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'home',
    component: shallowRef(Layout),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        // @ts-ignore
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  }
]


// 动态路由/user/myinfo/{id}
// 基于权限加载路由权限数据
export const dynamicRoutes: AppRouteRecordRaw[] = [
  {
    path: '/system/dict/value',
    name: 'dict-Layout',
    component: Layout,
    meta:{premissions:['system:dict-value:page']},
    hidden:true,
    children:[
      {
        path:':typeId(\\d+)',
        name:'dict-value',
        component:()=>import('@/views/system/dict/value/index.vue'),
        // component: () => import('@/views/dashboard/index.vue'),
        meta:{title:'系统菜单',activeMenu:'/system/dict/type'}
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: defaultRouter as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export default router
