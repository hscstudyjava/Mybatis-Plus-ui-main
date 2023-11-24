import { PermissionEnum } from "@/utils/constants/SystemConstants"
import type { DirectiveOptions, ELType } from "../../type";
import type { DirectiveBinding } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

/** 
 * 是否管理员
 */
const super_role = PermissionEnum.SPUER_ROLE;

const roleDirective: DirectiveOptions<'vRole'> = {
    name: "role",
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
            const currentUserRole = currentUser.value.roleList;
            const { value } = binding

            if (value && value instanceof Array && value.length > 0) {

                const roleFlag = value

                const hasPermissions = currentUserRole.some(role => {
                    return super_role === role || roleFlag.includes(role)
                })

                if (!hasPermissions) {
                    el.parentNode && el.parentNode.removeChild(el)
                }
            } else {
                throw new Error(`sorry your set not role DirectiveBinding value :(${value}) `)
            }
        }
    }
}

export default roleDirective;