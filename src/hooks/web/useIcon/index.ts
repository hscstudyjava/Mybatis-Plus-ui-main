import { h } from 'vue'
import type { VNode } from 'vue'
// @ts-ignore
import svgIcon from '@/components/svgIcon/index.vue'

// 定义类型
interface IconProp {
    icon: string,
    color?: string,
    size?: number
}

export const useIcon = (props: IconProp): VNode => {
    return h(svgIcon, props)
}
