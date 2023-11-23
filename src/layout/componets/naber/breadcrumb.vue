<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item, index) in level.list" :key="item.path">
                <span v-if="item.redirect === 'noRedirect' || index == level.list.length - 1" class="no-redirect">{{
                    item.meta.title }}</span>
                <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script setup lang="ts">
import router from '@/router';
import { onMounted, reactive, watch } from 'vue';
import type { RouteLocationNormalized, RouteRecordName } from 'vue-router';

/** 
 * 当前存在List
 */
var level = reactive<any>(
    {
        list: []
    }
)

/** 
 * 当前路由
 */
var currentRouter = router

/** 
 * 挂载后调用
 */
const onCreated = onMounted(() => {
    getBreadcrumb()
})


const watchRouter = watch(() => currentRouter.currentRoute.value,
    (newVlaue: any) => {

        if (newVlaue.path.startsWith('/redirect/')) {
            return
        }
        getBreadcrumb()
    }
    // { immediate: true }
)

const getBreadcrumb = () => {
    // 展示路由标题
    let matceh: any = currentRouter.currentRoute.value.matched.filter(item => item.meta && item.meta.title)
    const first = matceh[0]//获得第一个
    if (isDashboard(first)) {
        matceh = [{ path: '/index', meta: { title: '首页' } }].concat(matceh)
    }
    level.list = matceh.filter((item: any) => item.meta && item.meta.title && item.meta.breadcrumb !== false)
}
const isDashboard = (route: RouteLocationNormalized): boolean => {
    // 路由名称
    const name = route && route.name
    if (!name) {
        return false
    }
    let IndexName: RouteRecordName = "Index"
    return name === IndexName
}

/** 
 * 处理Link
 */
const handleLink = (currentItem: any) => {
    const { redirect, path } = currentItem
    if (redirect) {
        currentRouter.push(redirect)
        return
    }
    currentRouter.push(path)
}


</script>

<style scoped lang="scss">
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>