
<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}" 
  :style="{ backgroundColor: sideTheme === theme
  ? sytleConstant.menuBackground : sytleConstant.menuLightBackground }"
  >
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo 1" />
        <h1 v-else class="sidebar-title" :style="{ color: sideThemes === theme
        ? sytleConstant.logoTitleColor : sytleConstant.logoLightTitleColor }">{{ titles }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo 2" />
        <h1 class="sidebar-title" :style="{ color: sideThemes === theme
        ? sytleConstant.logoTitleColor : sytleConstant.logoLightTitleColor }">{{ titles }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script  setup lang="ts">
// @ts-ignore
import {useSettingStore} from '@/stores/setting'
// @ts-ignore
import logoUrl from "@/assets/img/logo/logo.png"
// @ts-ignore
import sytleConstant from '@/assets/style/sytleConstant.module.scss'

// @ts-ignore
import { LayoutThemeEnum } from '@/utils/constants/SystemConstants';
import { storeToRefs } from 'pinia';
// 开启
defineProps<{
    collapse:boolean
}>();

const theme=LayoutThemeEnum.THEME_DARK
const setting=useSettingStore()
const {sideTheme,title} = storeToRefs(setting)

var titles=title;
var sideThemes=sideTheme;
var logo=logoUrl

</script>

<style lang="scss">
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>