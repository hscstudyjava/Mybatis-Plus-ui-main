import { useUserStore } from "@/stores/user";
import { PermissionEnum } from "@/utils/constants/SystemConstants"
import { storeToRefs } from "pinia";

/**
 * 超级_权限
 */
const spuer_perssmin = PermissionEnum.SPUPER_PERSSION

/**
 * 超级管理员
 */
const super_role = PermissionEnum.SPUER_ROLE;


/** 
 * 提前说明,copy-->若依-vue
 */
export const auth = () => {
    
    const { currentUser } = storeToRefs(useUserStore())

    function authPermission(permission: string) {
        const permissions = currentUser.value.permissions;
        if (permission && permission.length > 0) {
            return permissions.some(v => {
                return spuer_perssmin === v || v === permission
            })
        } else {
            return false
        }
    }

    function authRole(role: string) {
        const roles = currentUser.value.roleList;
        if (role && role.length > 0) {
            return roles.some(v => {
                return super_role === v || v === role
            })
        } else {
            return false
        }
    }


    return {
        // 验证用户是否具备某权限
        hasPermi(permission: string) {
            return authPermission(permission);
        },
        // 验证用户是否含有指定权限，只需包含其中一个
        hasPermiOr(permissions: string[]) {
            return permissions.some(item => {
                return authPermission(item)
            })
        },
        // 验证用户是否含有指定权限，必须全部拥有
        hasPermiAnd(permissions: string[]) {
            return permissions.every(item => {
                return authPermission(item)
            })
        },
        // 验证用户是否具备某角色
        hasRole(role: string) {
            return authRole(role);
        },
        // 验证用户是否含有指定角色，只需包含其中一个
        hasRoleOr(roles: string[]) {
            return roles.some(item => {
                return authRole(item)
            })
        },
        // 验证用户是否含有指定角色，必须全部拥有
        hasRoleAnd(roles: string[]) {
            return roles.every(item => {
                return authRole(item)
            })
        }
    }
}