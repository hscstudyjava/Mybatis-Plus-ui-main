import type { Menu } from "@/types/menu";
import { defineStore } from "pinia";
import { ref, unref } from "vue";


export const useViewsStore = defineStore('tagViewsStore', () => {

    // 用户访问过的页面 就是标签栏导航显示的一个个 tag 数组集合
    const visitedViews = ref<Menu[]>([])
    // 实际 keep-alive 的路由。可以在配置路由的时候通过 meta.noCache 来设置是否需要缓存这个路由 默认都缓存。
    const cachedViews = ref<string[]>([])

    // 新增访问Tags
    const addVisitedView = (view: Menu) => {
        if (visitedViews.value.some(v => v.path === unref(view).path)) return
        // 如果Title登录空不保存
        if (unref(view).meta?.title) {
            visitedViews.value.push(
                Object.assign({}, view, {
                    title: view.meta?.title || 'no-name'
                })
            )                                                                                                 
        }

    }
    // 添加缓存Tags
    const addCacheView = (view: Menu) => {
        // @ts-ignore
        if (cachedViews.value.includes(unref(view).name)) return
        if (view.meta && view.meta.keepAlive) {
            // @ts-ignore
            cachedViews.value.push(unref(view).name)
        }
    }

    const delVisitedViews = (view: Menu) => {
        for (const [i, v] of unref(visitedViews).entries()) {
            if (v.path === view.path) {
                visitedViews.value.splice(i, 1)
                break
            }
        }
    }


    // 删除其他访问Tags
    const delOtherVisitedView = (view: Menu) => {
        // 
        visitedViews.value = unref(visitedViews).filter((v: Menu) => {
            return v?.meta?.affix || v.path === unref(view).path
        })
        /* / */
    }
    // 删除缓存标签
    const delCacheView = (view: Menu) => {
        const index = cachedViews.value.indexOf(unref(view).name)
        index > -1 && cachedViews.value.splice(index, 1)
    }
    // 删除其它缓存标签
    const delOtherCacheView = (view: Menu) => {
        const index = cachedViews.value.indexOf(unref(view).name)
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
    }

    // 删除右侧标签
    const delRightTag = (view: Menu) => {
        const index = visitedViews.value.findIndex(v => v.path === unref(view).path)
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
    }
    // 删除左侧标签
    const delLeftTags = (view: Menu) => {

        const index = visitedViews.value.findIndex(v => v.path === unref(view).path)

        if (index === -1) {
            return
        }
        visitedViews.value = visitedViews.value.filter((item, idx) => {
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
    }

    const delView = async (view: Menu) => {
        return new Promise(resolve => {
            delVisitedViews(view)
            delCacheView(view)
            resolve({
                visitedViews: [...visitedViews.value],
                cachedViews: [...cachedViews.value]
            })

        })
    }

    const delVisiteView = async (view: Menu) => {
        return new Promise(resolve => {
            delVisitedViews(view)
            resolve({
                visitedViews: [...visitedViews.value],
            })
        })
    }


    const delCachedView = async (view: Menu) => {
        return new Promise(resolve => {
            delCacheView(view)
            resolve({
                cachedViews: [...cachedViews.value]
            })
        })
    }

    const delOthersViews = async (view: Menu) => {
        return new Promise(resolve => {
            delOtherCacheView(view)
            delOtherVisitedView(view)
            resolve({
                visitedViews: [...visitedViews.value],
                cachedViews: [...cachedViews.value]
            })
        })
    }

    const delOthersVisitedViews = async (view: Menu) => {
        return new Promise(resolve => {
            delOtherVisitedView(view)
            resolve({
                visitedViews: [...visitedViews.value],
            })
        })
    }

    const delOthersCachedViews = async (view: Menu) => {
        return new Promise(resolve => {
            delOtherCacheView(view)
            resolve({
                cachedViews: [...cachedViews.value]
            })
        })
    }

    const delAllViews = async (view: Menu) => {
        return new Promise(resolve => {
            delAllVisitedViews(view)
            delAllCahce()
            resolve({
                visitedViews: [...visitedViews.value],
                cachedViews: [...cachedViews.value]
            })
        })
    }

    const delAllVisited = async (view: Menu) => {
        return new Promise(resolve => {
            delAllVisitedViews(view)
            resolve({
                visitedViews: [...visitedViews.value],
            })
        })
    }

    const delAllCahced = async (view: Menu) => {
        return new Promise(resolve => {
            delAllCahce()
            resolve({
                cachedViews: [...cachedViews.value]
            })
        })
    }

    const updateVisited = async (view: Menu) => {
        updateVisitedView(view)
    }

    // 删除右侧路由标签缓存
    const delRight = async (view: Menu) => {
        return new Promise(resolve => {
            delRightTag(view)
            resolve([...visitedViews.value])
        })
    }

    const delLeft = async (view: Menu) => {
        return new Promise(resolve => {
            delLeftTags(view)
            resolve([...visitedViews.value])
        })
    }



    // 暴漏方法
    return {
        addVisitedView,
        addView,
        delView,
        delVisiteView,
        delCachedView,
        delOthersViews,
        delOthersVisitedViews,
        delOthersCachedViews,
        delAllViews,
        delAllVisited,
        delAllCahced,
        updateVisited,
        delRight,
        delLeft,

        visitedViews,
        cachedViews
    }
})