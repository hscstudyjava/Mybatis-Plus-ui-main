<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <!--  <keep-alive :include="cachedViews">
                <router-view v-if="!$route.meta.link" :key="key" />
            </keep-alive>    -->
            <keep-alive>
                <router-view v-if="route.meta" :key="route.path" />
            </keep-alive>
        </transition>
        <!-- <iframe-toggle /> -->
    </section>
</template>

<script setup lang="ts">
import router from '@/router';
import { computed } from 'vue';

const route = router.currentRoute.value;

const getKey = 
() => computed<string>((router) => {
    return router.currentRoute.value.path
})

</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
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