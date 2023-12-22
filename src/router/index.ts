import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
// @ts-ignore
import login from '@/views/login.vue';
// @ts-ignore
import Layout from '@/layout/index.vue'
// @ts-ignore
import ParentView from '@/components/ParentView/index.vue'
// @ts-ignore
import NotFound from '@/views/NotFound/index.vue';
import type { AppRouteRecordRaw, Menu } from '@/types/menu';

/**
 *  {
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/404',
      name: '404',
      component: NotFound,
    },
    {
      path: '/:w+',
      name:'*',
      redirect: '/404'
    },
    {
      path: '/',
      name: 'home',
      component: Layout,
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
    },
    {
      path: '/system',
      name: 'system',
      component: Layout,
      redirect: '/system/user',
      meta: { title: '系统管理', icon: 'system' },
      children: [{
        path: 'user',
        name: 'user',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户信息', icon: 'user' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色信息', icon: 'role' }
      },
      {
        path: 'permisson',
        name: 'permission',
        component: () => import('@/views/system/permission/index.vue'),
        meta: { title: '权限信息', icon: 'role' }
      }, {
        path: 'dept',
        name: 'dept',
        component: () => import('@/views/system/dept/index.vue'),
        meta: { title: '部门信息', icon: 'dept' }
      },
      {
        path: 'config',
        name: 'config',
        component: () => import('@/views/system/config/index.vue'),
        meta: { title: '配置信息', icon: 'config' }
      },
      {
        path: 'dict',
        name: 'dict',
        component: ParentView,
        meta: { title: '字典管理', icon: 'config' },
        children: [
          {
            path: 'type',
            name: 'type',
            component: () => import('@/views/system/dict/index.vue'),
            meta: { title: '字典类型', icon: 'config' },
          },
          {
            path: 'value/:typeId(\\d+)',
            name: 'value',
            component: () => import('@/views/system/dict/value/index.vue'),
            meta: { title: '字典数据', icon: 'config' },
          },

        ]
      },
      {
        path: 'notice',
        name: 'notice',
        component: ParentView,
        meta: { title: '信息管理', icon: 'config' },
        children: [
          {
            path: 'template',
            name: 'template',
            component: () => import('@/views/system/notice/template/index.vue'),
            meta: { title: '模板管理', icon: 'config' }
          },
          {
            path: 'log',
            name: 'log',
            component: () => import('@/views/system/notice/template/log.vue'),
            meta: { title: '消息记录', icon: 'config' }
          },
        ]
      },

      ]
    }
 */

// 默认路由
export const defaultRouter :AppRouteRecordRaw[]= [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/404',
    name: '404',
    component: NotFound,
  },
  {
    path: '/',
    name: 'home',
    component: Layout,
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
export const dynamicRoutes=[

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: defaultRouter as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export default router
