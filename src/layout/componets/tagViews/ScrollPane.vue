<template>
  <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.native.prevent="handleScroll">
    <slot />
  </el-scrollbar>
</template>

<script setup lang="ts">
import type { ElScrollbar } from 'element-plus';
import { onMounted, onBeforeUnmount, ref, getCurrentInstance, unref, toRefs, toRef } from 'vue'

const tagAndTagSpacing = 4 // tagAndTagSpacing
const left = ref(0)
const scrollContainer = ref()


const scrollWrapper = unref(scrollContainer)?.wrapRef

const handleScroll = (e: any) => {
  const eventDelta = e.wheelDelta || - e.deltaY * 40
  const scrollWrapperValue = scrollWrapper.value
  scrollWrapper.scrollLeft = scrollWrapper.scrollLeft + eventDelta / 4
}

const emit = defineEmits(['scroll'])

const emitScroll = () => {
  console.log("1111");
  
  emit('scroll')
}
const currentCpn = getCurrentInstance();


const moveToTarget = (currentTag: any) => {
  // 解构获得属性 操!!!
  const $container = unref(scrollContainer)
  const $containerWidth = $container.offsetWidth
  const $scrollWrapper = unref(scrollContainer).wrapRef
  const tagList: any = currentCpn?.parent?.refs.tag;

  let firstTag = null
  let lastTag = null
  // find first tag and last tag
  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }
  if (firstTag === currentTag) {
    $scrollWrapper.scrollLeft = 0
  } else if (lastTag === currentTag) {
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
  } else {
    // find preTag and nextTag
    const currentIndex = tagList.findIndex((item: any) => item === currentTag)
    const prevTag = tagList[currentIndex - 1]
    const nextTag = tagList[currentIndex + 1]
    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing
    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing
    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
      $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
    }
  }
}


defineExpose({
  moveToTarget,
  handleScroll,
  scrollWrapper,
  left
})
onMounted(() => {
  unref(scrollContainer).wrapRef.addEventListener('scroll', emitScroll, true)
})
onBeforeUnmount(() => {
  unref(scrollContainer).wrapRef.removeEventListener('scroll', emitScroll)
})
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;

  :v-deep(.el-scrollbar__bar) {
    bottom: 0px;
  }

  :v-deep(.el-scrollbar__wrap) {
    height: 49px;
  }
}
</style>
