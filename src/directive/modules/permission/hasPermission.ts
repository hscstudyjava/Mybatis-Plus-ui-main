import { PermissionEnum } from "@/utils/constants/SystemConstants"
import type { DirectiveOptions, ELType } from "../../type";
import type { DirectiveBinding } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

/**
 * 超级_权限
 */
const spuer_perssmin = PermissionEnum.SPUPER_PERSSION
/**
 * 权限指令
 * 
 * 使用v-permission='['a','b','c']'
 */
const permissionDirective: DirectiveOptions<'vPeri'> = {
    name: 'peri',
    directive: {

        /**
         * 
        el：指令绑定到的元素。这可以用于直接操作 DOM。

        binding：一个对象，包含以下属性。

        vnode：代表绑定元素的底层 VNode。

        prevNode：代表之前的渲染中指令所绑定元素的 VNode。仅在 beforeUpdate 和 updated 钩子中可用。
         */
        mounted(el: ELType, binding: DirectiveBinding<Array<String>>, vNode: any, preNode: any) {
        
            const user = useUserStore();
            const { currentUser } = storeToRefs(user)
            // 当前登录人的权限值
            const currentUserPerssion = currentUser.value.permissions
            //获得传递给指令的值。例如在 v-my-directive="1 + 1" 中，值是 2。
            const { value } = binding
            
            if (value && value instanceof Array && value.length > 0) {

                const permissionFlag = value

                const hasPermissions = currentUserPerssion.some(permission => {
                    return spuer_perssmin === permission || permissionFlag.includes(permission)
                })

                if (!hasPermissions) {
                    el.parentNode && el.parentNode.removeChild(el)
                }
            } else {
                throw new Error(`sorry your set not permission DirectiveBinding value :(${value}) `)
            }
        }

    },
};

export default permissionDirective;