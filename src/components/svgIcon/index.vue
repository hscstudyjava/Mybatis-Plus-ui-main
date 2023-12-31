
<template>
  <el-icon :color="color" :size="size">
    <span v-if="isHttp" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$attrs"></span>
    
    <!-- 如果icon是iconfy -->
    <IconifyIcon v-if="isIconify" :icon="iconName" :style="iconStyle" aria-hidden="true" v-on="$attrs"/>

    <svg v-else :class="svgClass" aria-hidden="true" v-on="$attrs">
      <use :xlink:href="iconName"/>
    </svg>
  </el-icon>
</template>

<script setup lang="ts">
import { defineProps, computed, type PropType } from 'vue';
// @ts-ignore
import { Icon as IconifyIcon } from '@iconify/vue';
import { isExternal } from '@/utils/verify';
import { propTypes } from '@/utils/verify/propTypes';

const props = defineProps({
  color: {
    type: String as PropType<string>,
    default: ''
  },
  icon: {
    type: String as PropType<string>,
    default: ''
  },
  className: {
    type: String as PropType<string>,
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

const iconStyle = computed(() => ({
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