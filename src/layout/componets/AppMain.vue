<template>
    <section class="app-main">

        <router-view>
            <template #default="{ Component, route }">
                <keep-alive :include="getCache">
                    <component :is="Component" :key="route.name"/>
                </keep-alive>
            </template>
        </router-view>
        <!-- 
            <keep-alive :include="cachedViews">
                <div v-if="config.hidden">
                    <el-watermark class="watermark" :content="config.content" :font="config.font" :z-index="config.zIndex"
                        :rotate="config.rotate" :gap="config.gap" :offset="config.offset">
                        <router-view v-if="!route.meta.link" :key="route.fullPath" />
                    </el-watermark>
                </div>
                <div v-else>
                    <router-view v-if="!route.meta.link" :key="route.fullPath" />
                </div>
            </keep-alive> -->


        <!-- <iframe-toggle /> -->
    </section>
</template>

<script setup lang="ts">
import router from '@/router';
import { onMounted, computed, reactive, unref } from 'vue';
import { useViewsStore } from '@/stores/tagViews'

const { cachedViews } = storeToRefs(useViewsStore())
const getCache = computed((): string[] => {
    return Array.from(cachedViews.value)
})


const route = router.currentRoute.value;
import { useSettingStore } from '@/stores/setting';
import { storeToRefs } from 'pinia';
const setting = useSettingStore()

const config = reactive({
    hidden: setting.watermark,
    content: setting.watermarkContext,
    font: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.15)',
    },
    zIndex: -1,
    rotate: -22,
    gap: [100, 100] as [number, number],
    offset: [] as unknown as [number, number],
})

const getKey = computed(():string => {
    return unref(route).name as string
})


</script>

<style lang="scss" scoped>
.watermark {
    height: 100%;
    // display: flex;
    // flex: auto;
}

.app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
}

.fixed-header+.app-main {
    padding-top: 50px;
}

.hasTagsView {
    .app-main {
        /* 84 = navbar + tags-view = 50 + 34 */
        min-height: calc(100vh - 84px);
    }

    .fixed-header+.app-main {
        padding-top: 84px;
    }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 17px;
    }
}
</style>