<!-- 
<template>
  <el-icon>
    <div v-if="isHttp" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$attrs"></div>
    <svg v-else :class="svgClass" aria-hidden="true" v-on="$attrs">
      <use :xlink:href="iconName" stroke="none" stroke-width="1" :fill="color" fill-rule="evenodd" />
    </svg>
  </el-icon>
</template>
<script setup lang='ts'>
// @ts-ignore
import { Icon } from '@iconify/vue'
import { isExternal } from '@/utils/verify'
import { computed } from 'vue'

// 是否为http//https
const isHttp = computed(() => {
  return isExternal(iconProp.icon)
})
// icon
const iconName = computed(() => {
  if (iconProp.className) return `#${prefixName.value}${iconProp.className}`
  return `${prefixName.value}`
})

// svg
const svgClass = computed(() => {
  if (iconProp.className) {
    return 'svg-icon ' + iconProp.className
  } else {
    return 'svg-icon'
  }
})

// 判断是否有前缀|如果有前缀使用前缀|没有前缀则使用icon自定义icon
const prefixName = computed(() => {
  if (iconProp.icon.includes(":")) {
    return "carbon:accessibility";
  }
  return "#icon-"
})


const styleExternalIcon = computed(() => {
  return {
    mask: `url(${iconProp.icon}) no-repeat 50% 50%`,
    '-webkit-mask': `url(${iconProp.icon}) no-repeat 50% 50%`
  }
})



const iconProp = defineProps({
  // 颜色
  color: {
    type: String,
    default: ''
  },
  // icon
  icon: {
    type: String,
    default: ''
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
</style> -->
<template>
  <el-icon>
    <span v-if="isHttp" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$attrs"></span>
    
    <!-- 如果icon是iconfy -->
    <IconifyIcon v-if="isIconify" :icon="iconName" :class="svgClass" aria-hidden="true" v-on="$attrs"/>

    <svg v-else :class="svgClass" aria-hidden="true" v-on="$attrs">
      <use :xlink:href="iconName"/>
    </svg>
  </el-icon>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
// @ts-ignore
import { Icon as IconifyIcon } from '@iconify/vue';
import { isExternal } from '@/utils/verify';
import { propTypes } from '@/utils/verify/propTypes';

const props = defineProps({
  color: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  },
  size: propTypes.number.def(16),
});

const iconName = computed(() => {
  if (props.icon.includes(":")) {
    return props.icon; // 使用带前缀的 icon 名称
  } else {
    return `#icon-${props.icon}`; // 使用自定义前缀
  }
});

const isHttp = computed(() => isExternal(props.icon));

const styleExternalIcon = computed(() => ({
  mask: `url(${props.icon}) no-repeat 50% 50%`,
  '-webkit-mask': `url(${props.icon}) no-repeat 50% 50%`
}));

const svgStyle = computed(() => ({
  fill: props.color,
  fontSize: `${props.size}px`,
  height: '1em',
  stroke: 'none',
  'stroke-width': '1',
  'fill-rule': 'evenodd'
}));

const svgClass = computed(() => {
  if (props.className) {
    return 'svg-icon ' + props.className;
  } else {
    return 'svg-icon';
  }
});

const isIconify = computed(() => {
  return props.icon.includes(":")
})


const iconComponent = computed(() => {
  if (props.icon.includes(":")) {
    return IconifyIcon; // 使用 IconifyIcon 组件
  } else {
    return 'svg'; // 使用内联 SVG 渲染
  }
});
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