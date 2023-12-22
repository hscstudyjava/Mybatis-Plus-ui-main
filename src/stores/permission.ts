
// @ts-ignore
import Layout from '@/layout/index.vue';//基础组件
// @ts-ignore
import ParentView from '@/components/ParentView/index.vue';
import { getRouter } from "@/api/login/login";
import type { Menu } from "@/types/menu";
import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";

import router, { defaultRouter, dynamicRoutes } from '@/router';
// 获得目录下方所有的Vue组件
const modules = import.meta.glob('@/views/**/**.vue')

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: any,
  lastRouter: any = false,
  type: any = false) {
  return asyncRouterMap.filter((route: Menu) => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }

    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        // route.component = markRaw(defineAsyncComponent(()=>import('@/layout/index.vue')))
        route.component = shallowRef(Layout)
      } else if (route.component === 'ParentView') {
        route.component = shallowRef(ParentView)
      } else if (route.component === 'InnerLink') {
        // route.component = InnerLink
      } else {
        //生成菜单
        route.component = loadView(route.component)
      }
    }
    if (route.children != null
      && route.children
      && route.children.length) {

      route.children = filterAsyncRouter(route.children, route, type)

    } else {
      // @ts-ignore
      delete route['children']
      // @ts-ignore
      delete route['redirect']
    }
    return true
  })
}


export const loadView = (view: String) => {
  return modules[`/src/views${view}/index.vue`]
}

function filterChildren(childrenMap: any, lastRouter: any = false) {
  var children: Array<Menu> = []

  childrenMap.forEach((el: Menu, index: number) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
/* export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}
 */

export const usePeriStroe = defineStore('permisionStore', () => {

  /**
   * 添加路由
   */
  var routes = ref<Array<Menu>>([])

  /**
   * 全部路由
   */
  var allRouter = ref<Array<Menu>>([])

  /**
   * 默认路由
   */
  var defaultRoutes = ref<Array<Menu>>([])

  /**
   * topNav菜单
   */
  var topbarRouters = ref<Array<Menu>>([])

  /**
   * 侧边菜单
   */
  var sidebarRouters = ref<Array<Menu>>([])
  /**
   *  SET_ROUTES: (state, route) => {
    state.addRoutes = route
    state.routes = constantRoutes.concat(route)
  },

  SET_DEFAULT_ROUTES: (state, routes) => {
    state.defaultRoutes = constantRoutes.concat(routes)
  },
  SET_TOPBAR_ROUTES: (state, routes) => {
    state.topbarRouters = routes
  },
  SET_SIDEBAR_ROUTERS: (state, routes) => {
    state.sidebarRouters = routes
  },
   */
  const setRouters = (route: Menu[]) => {
    allRouter.value = route
    // @ts-ignore
    routes.value = defaultRouter.concat(route)
  }

  const setDefaultRoutes = (route: Menu[]) => {
    // @ts-ignore
    defaultRoutes.value = defaultRouter.concat(route)
  }

  const setTopRouters = (route: Menu[]) => {
    topbarRouters.value = route
  }

  const setSidebarRoute = (rotue: Menu[]) => {
    sidebarRouters.value = rotue
  }

  /**
   * 加载路由
   * 
   * 
   */


  const loadingRouter = () => {
    return new Promise(((resolve, reject) => {

      // 获得路由数据
      getRouter().then(res => {
        let { data } = res
        const sRouter = JSON.parse(JSON.stringify(data));
        const rRouter = JSON.parse(JSON.stringify(data));
        // 侧边栏目
        // @ts-ignore
        const sidebarRoutes = filterAsyncRouter(sRouter)
        // @ts-ignore
        const rewriteRoutes = filterAsyncRouter(rRouter, false, true)
        /** 
         * commit('SET_ROUTES', rewriteRoutes)
            commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
            commit('SET_DEFAULT_ROUTES', sidebarRoutes)
            commit('SET_TOPBAR_ROUTES', sidebarRoutes)
         */
        setRouters(rewriteRoutes)
        // @ts-ignore
        setSidebarRoute(defaultRouter.concat(sidebarRoutes))
        setDefaultRoutes(sidebarRoutes)
        setTopRouters(sidebarRoutes)
        resolve(rewriteRoutes)
      }).catch(error => {
        reject(error)
      })


    }))

  }

  return {
    loadingRouter,
    sidebarRouters
  }

})