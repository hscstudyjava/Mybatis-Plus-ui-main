<script setup lang="ts">
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'// 使用中文

import { reactive, } from 'vue';
import { RouterView } from 'vue-router';
import { useSettingStore } from './stores/setting';
import { storeToRefs } from 'pinia';
import CacheUtils from '@/utils/cache/CacheUtils'
import { CacheConstants } from './utils/cache/CacheConstatns';

const useStting = useSettingStore()

// 将 isDark 转换为响应式对象
const { isDark } = storeToRefs(useStting)

const setDefaultTheme = () => {
  useStting.setDark(isDark.value)
}
setDefaultTheme()
// element-plus全局修改
const elementConfig = reactive({
  // 国际化
  //locale	翻译文本对象
  i8n: zhCn,
  // 自动在两个中文字符之间插入空格
  autoInsertSpace: true,
  // 'large' | 'default' | 'small'
  //size	全局组件大小
  size: 'small',
  // 消息内容条数
  max: 5
})

</script>


<template>
  <el-config-provider :size="elementConfig.size" :locale="elementConfig.i8n" :button="elementConfig"
    :message="elementConfig">
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
