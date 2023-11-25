
<template>
  <div v-if="isHttp" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$attrs"></div>
  <div v-else>
    <svg :class="svgClass" aria-hidden="true" v-on="$attrs">
      <use :xlink:href="iconName" stroke="none" stroke-width="1" :fill="color"
      fill-rule="evenodd" />
    </svg>
  </div>
</template>
<script setup lang='ts'>
import { isExternal } from '@/utils/verify'
import { computed } from 'vue'

// 是否为http//https
const isHttp = computed(() => {
  return isExternal(iconProp.iconClass)
})
// icon
const iconName = computed(() => {
  if (iconProp.className) return `#icon-${iconProp.className}`
  return `#icon-${iconProp.iconClass}`
})

// svg
const svgClass = computed(() => {
  if (iconProp.className) {
    return 'svg-icon ' + iconProp.className
  } else {
    return 'svg-icon'
  }
})

const styleExternalIcon = computed(() => {
  return {
    mask: `url(${iconProp.iconClass}) no-repeat 50% 50%`,
    '-webkit-mask': `url(${iconProp.iconClass}) no-repeat 50% 50%`
  }
})



const iconProp = defineProps({
  // 颜色
  color: {
    type: String,
    default: ''
  },
  // icon
  iconClass: {
    type: String,
    required: true
  },
  // 默认样式
  className: {
    type: String,
    default: ''
  }

})


</script>
<style scoped lang='scss'>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>