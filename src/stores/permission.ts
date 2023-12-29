
// @ts-ignore
import Layout from '@/layout/index.vue';//基础组件
// @ts-ignore
import ParentView from '@/components/ParentView/index.vue';
import { getRouter } from "@/api/login/login";
import type { AppRouteRecordRaw, Menu } from "@/types/menu";
import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
import { useWsStore } from '@/utils/cache/CacheUtils';
import {auth} from '@/hooks/web/auth/index'

const ws = useWsStore('sessionStorage') //存储到Session中避免数据,个人设置60秒拉取数据

import router, { defaultRouter, dynamicRoutes } from '@/router';
import { CacheConstants } from '@/utils/cache/CacheConstatns';
import type { RouteRecordRaw } from 'vue-router';
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

/**
 * 建议需要按照这种格式填充数据
 * @param view /system/user
 * @returns 组件
 */
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
export function filterDynamicRoutes(routes:AppRouteRecordRaw[]) {
  const res:AppRouteRecordRaw[] = []
  
  routes.forEach(route => {
    if (route.meta?.premissions) {
      if (auth().hasPermiOr(route.meta?.premissions)) {
        res.push(route)
      }
    } else if (route.meta?.roles) {
      if (auth().hasRoleOr(route.meta?.roles)) {
        res.push(route)
      }
    }
  })
  return res
}


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

  const loadingRouter = () => {
    return new Promise((resolve, reject) => {
      try {
        let data = [];
        const cacheRouter = ws.get(CacheConstants.ROUTER_KEY);        
        if (cacheRouter) {
          data = cacheRouter;
          processRoutes(data, resolve);
        } else {
          getRouter().then((res) => {
            data = res.data;
            ws.set(CacheConstants.ROUTER_KEY, data, { exp: 60 });
            processRoutes(data, resolve);
          }).catch((error) => {
            reject(error);
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  };
  // @ts-ignore
  const processRoutes = (data, resolve) => {
    const sRouter = JSON.parse(JSON.stringify(data));
    const rRouter = JSON.parse(JSON.stringify(data));
    const sidebarRoutes = filterAsyncRouter(sRouter, true);
    const rewriteRoutes = filterAsyncRouter(rRouter, false, true);

    //获得动态路由
    const dynamicRoute=filterDynamicRoutes(dynamicRoutes)
    // 这个数据也一并添加到rewriteRoutes
    dynamicRoute.forEach(item=>{
      router.addRoute(item as unknown as RouteRecordRaw)
    })

    rewriteRoutes.push({
      path: '/:pathMatch(.*)*',
      name: '*',
      redirect: '/error/404'
    });
    setRouters(rewriteRoutes);
    //@ts-ignore
    setSidebarRoute(defaultRouter.concat(sidebarRoutes));
    setDefaultRoutes(sidebarRoutes);
    setTopRouters(sidebarRoutes);
    resolve(rewriteRoutes);
  };


  return {
    loadingRouter,
    sidebarRouters,
    routes
  }

})