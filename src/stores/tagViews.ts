import type { Menu } from "@/types/menu";
import { defineStore } from "pinia";
import { ref } from "vue";


export const useViewsStore = defineStore('tagViewsStore', () => {

    // 用户访问过的页面 就是标签栏导航显示的一个个 tag 数组集合
    const visitedViews = ref<Menu[]>([])
    // 实际 keep-alive 的路由。可以在配置路由的时候通过 meta.noCache 来设置是否需要缓存这个路由 默认都缓存。
    const cachedViews = ref<string[]>([])

    // 新增访问Tags
    const addVisitedView = (view: Menu) => {
        if (visitedViews.value.some(v => v.path === view.path)) return
        visitedViews.value.push(
            Object.assign({}, view, {
                title: view.meta?.title || 'no-name'
            })
        )
    }
    // 添加缓存Tags
    const addCacheView = (view: Menu) => {
        // 已存在缓存就不缓存了
        if (cachedViews.value.includes(view.name)) return
        if (view.meta && !view.meta.noCache) {
            cachedViews.value.push(view.name)
        }
    }
    // 删除选择的标签
    const deleVisitedView = (view: Menu) => {
        const index = cachedViews.value.indexOf(view.name)
        if (index > -1) {
            cachedViews.value = cachedViews.value.slice(index, index + 1)
        } else {
            cachedViews.value = []
        }
    }
    // 删除缓存标签
    const delCacheView = (view: Menu) => {
        const index = cachedViews.value.indexOf(view.name)
        index > -1 && cachedViews.value.splice(index, 1)
    }
    // 删除其它缓存标签
    const delOtherCacheView = (view: Menu) => {
        const index = cachedViews.value.indexOf(view.name)
        if (index > -1) {
            cachedViews.value = cachedViews.value.slice(index, index + 1)
        } else {
            cachedViews.value = []
        }
    }


    // 删除所有标签
    const delAllVisitedViews = (view: Menu) => {
        const affixTags = visitedViews.value.filter(tag => tag?.meta?.affix)
        visitedViews.value = affixTags
    }

    // 删除所有缓存标签
    const delAllCahce = () => {
        cachedViews.value = []
    }

    const updateVisitedView = (view: Menu) => {
        for (let v of visitedViews.value) {
            if (v.path === view.path) {
                v = Object.assign(v, view)
                break
            }
        }
    },

    // 删除右侧标签
    const delRightTag = (view: Menu) => {
        const index = visitedViews.value.findIndex(v => v.path === view.path)
        if (index === -1) {
            return
        }
        visitedViews.value = visitedViews.value.filter((item, idx) => {
            if (idx <= index || (item.meta && item.meta.affix)) {
                return true
            }
            const i = cachedViews.value.indexOf(item.name)
            if (i > -1) {
                cachedViews.value.splice(i, 1)
            }
            return false
        })
    },
    // 删除左侧标签
    const delLeftTags = (view: Menu) => {
        const index = visitedViews.value.findIndex(v => v.path === view.path)
        if (index === -1) {
            return
        }
        visitedViews.value. = visitedViews.value.filter((item, idx) => {
            if (idx >= index || (item.meta && item.meta.affix)) {
                return true
            }
            const i = cachedViews.value.indexOf(item.name)
            if (i > -1) {
                cachedViews.value.splice(i, 1)
            }
            return false
        })
    }


    const addView = (view: Menu) => {
        addCacheView(view)
        addVisitedView(view)
    },


// 新增当前路由标签
onst addVisitedView = (view: Menu) =>

addVisitedView(view)
  },
  // 新增当前路由标签缓存
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },    





})

/** 

const actions = {
  // 新增当前路由标签和标签缓存
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  // 新增当前路由标签
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  // 新增当前路由标签缓存
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },
  // 删除当前路由标签和标签缓存
  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  // 删除当前路由标签
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  // 删除当前路由标签缓存
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },
  // 删除其他路由标签和标签缓存
  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  // 删除其他路由标签
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  // 删除其他路由标签缓存
  delOthersCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },
  // 删除所有路由标签和标签缓存
  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  // 删除所有路由标签
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  // 删除所有路由标签缓存
  delAllCachedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },

  updateVisitedView({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view)
  },
  // 删除右侧路由标签缓存
  delRightTags({ commit }, view) {
    return new Promise(resolve => {
      commit('DEL_RIGHT_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  // 删除左侧路由标签缓存
  delLeftTags({ commit }, view) {
    return new Promise(resolve => {
      commit('DEL_LEFT_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}



 */