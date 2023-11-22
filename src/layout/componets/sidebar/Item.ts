// @ts-ignore
import type { MenuItems } from '@/types/menu';
// menu_item
import { render, defineProps, type VNode, type PropType } from 'vue'

const ReanderItem = () => {
    // 默认的父子传值
    const menuItemProps = defineProps({
        menuItem: {
            type: Object as PropType<MenuItems>,
            required: true
        }
    })

    const renderMenuItem = () => {
        render: () => {
            const currentMenuItem: MenuItems = menuItemProps.menuItem
            const vnodes = []

            if (currentMenuItem.icon) {
                vnodes.push(`<svg-icon icon-class=${currentMenuItem.icon}></svg-icon>`)
            }

            if (currentMenuItem.title.length > 5) {
                vnodes.push(`<span slot='title' title={(${currentMenuItem.title})}>${currentMenuItem.title}</span>`)
            } else {
                vnodes.push(`<span slot='title'>${currentMenuItem.title}</span>`)
            }

            return vnodes;
        }
    }
}

export default ReanderItem