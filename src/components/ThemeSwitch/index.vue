<script lang='ts' setup>
import { useIcon } from '@/hooks/web/useIcon'
import { useSettingStore } from '@/stores/setting';
import { storeToRefs } from 'pinia';

import { useDark, useToggle } from '@vueuse/core'

const useStting = useSettingStore()

// 将 isDark 转换为响应式对象
const { isDark } = storeToRefs(useStting)

/* const dark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
  onChanged(dark: boolean) {
    useStting.setDark(dark)
  },
}) */

const Sun = useIcon({ icon: 'emojione-monotone:sun', color: '#fde047' })
const CrescentMoon = useIcon({ icon: 'emojione-monotone:crescent-moon', color: '#fde047' })

const blackColor = 'var(--el-color-black)'

const toggleDark = () => {    
  useStting.setDark(isDark.value)
}
</script>
<template>
  <ElSwitch v-model="isDark" :active-color="blackColor" :active-icon="Sun" :border-color="blackColor"
    :inactive-color="blackColor" :inactive-icon="CrescentMoon" inline-prompt @change="toggleDark" />
</template>

<style lang='scss' scoped>
:deep(.el-switch__core .el-switch__inner .is-icon) {
  overflow: visible;
}
</style>