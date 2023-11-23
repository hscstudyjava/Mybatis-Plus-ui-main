<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <!--  <keep-alive :include="cachedViews">
                <router-view v-if="!$route.meta.link" :key="key" />
            </keep-alive>    -->
            <keep-alive>
                
                <div v-if="config.hidden">
                    <el-watermark class="watermark" :content="config.content" :font="config.font" :z-index="config.zIndex"
                        :rotate="config.rotate" :gap="config.gap" :offset="config.offset">
                        <svg-icon iconClass="dashboard"></svg-icon>
                        <router-view v-if="!route.meta" :key="route.path" />
                    </el-watermark>
                </div>

                <div v-else>
                    <router-view :key="route.path" />
                </div>
            </keep-alive>
        </transition>
        <!-- <iframe-toggle /> -->
    </section>
</template>

<script setup lang="ts">
import router from '@/router';
import { computed, reactive } from 'vue';

const route = router.currentRoute.value;
import { useSettingStore } from '@/stores/setting';
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

const getKey =
    () => computed<string>((router) => {
        return router.currentRoute.value.path
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