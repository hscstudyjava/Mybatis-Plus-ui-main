<script lang='ts' setup>
import { nextTick, reactive, ref } from 'vue';
import { parseTime } from '@/utils/common'
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import type { SimpleTree, SysDept, SysPermisson, SysRole } from '@/api/system/type';
import { authRoleDept, authRolePeri, queryRoleById, type SysRoleAuthVO } from '@/api/system/role';
//------------------------基础模板-------------------------------------------------
defineOptions({
    name: 'authPeriFrom'
})

const props = withDefaults(
    defineProps<{
        deptList: SimpleTree<SysDept>[]
    }>(),
    {}
)
const diologOpen = ref(false)
const diologTitle = ref('')
const loading = ref(false)
const menuExpand = ref(false) // 展开/折叠
const treeRef = ref() // 菜单树组件 Ref
const treeNodeAll = ref(false) // 全选/全不选
const checkStrictly = ref(false) // 父子联动
const fromRef = ref()
const from = reactive<SysRoleAuthVO>({
    roleName: '',
    roleKey: '',
    isDeleted: 0,
    status: '',
    createBy: '',
    updateBy: '',
    remark: '',
    sortValue: 0,
    deptIdList: [],
    permissionIdList: []
})

const open = async (roleId: number) => {
    loading.value = true
    diologOpen.value = true
    try {
        const { data } = await queryRoleById(roleId)
        Object.assign(from, data)
        nextTick(() => {
            treeRef.value.setCheckedKeys(from.deptIdList)
            loading.value = false
        }) 
    } catch (error: any) {
        messages.error(error?.msg)
        diologOpen.value = false
    }
}
const emit = defineEmits(['success'])
defineExpose({ open })
const submit = async () => {
    try {
        await authRoleDept(from.roleId!!, [
            ...(treeRef.value.getCheckedKeys(false) as unknown as Array<string>), // 获得当前选中节点
            ...(treeRef.value.getHalfCheckedKeys() as unknown as Array<string>) // 获得半选中的父节点
        ])
        resetFrom()
        messages.success("授权成功")
        diologOpen.value = false
        emit('success')
    } catch (error: any) {
        messages.error(error?.msg)
    }
}
/** 全选/全不选 */
const handleCheckedTreeNodeAll = () => {
    treeRef.value.setCheckedNodes(treeNodeAll.value ? props.deptList : [])
}

/** 展开/折叠全部 */
const handleCheckedTreeExpand = () => {
    const nodes = treeRef.value?.store.nodesMap
    for (let node in nodes) {
        if (nodes[node].expanded === menuExpand.value) {
            continue
        }
        nodes[node].expanded = menuExpand.value
    }
}

// 重置表单
const resetFrom = () => {
    Object.assign(from, {
        roleName: '',
        roleKey: '',
        isDeleted: 0,
        status: '',
        createBy: '',
        updateBy: '',
        remark: '',
        sortValue: 0,
        deptIdList: [],
        permissionIdList: []
    })
    checkStrictly.value = false
    treeNodeAll.value = false
    menuExpand.value = false
    fromRef.value?.resetFields()
}
</script>
<template>
    <div class='app-context'>
        <el-dialog v-model="diologOpen" :close-on-click-modal="false" :draggable="true" :align-center="true" width="50%">
            <template #header="{ close, titleId, titleClass }">
                <div class="my-header">
                    <h6 :id="titleId">{{ diologTitle }}</h6>
                    <el-divider />
                </div>
            </template>

            <el-form :model="from" v-loading="loading" ref="fromRef" status-icon label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="from.roleName" disabled placeholder="请填写用户账号" clearable></el-input>
                </el-form-item>

                <el-form-item label="角色字符" prop="roleKey">
                    <el-input v-model="from.roleKey" disabled placeholder="请填写用户昵称" clearable></el-input>
                </el-form-item>

                <el-form-item label="数据权限" prop="postIdList">
                    <el-card class="cardHeight">

                        <template #header>
                            全选/全不选:
                            <el-switch v-model="treeNodeAll" active-text="是" inactive-text="否" inline-prompt
                                @change="handleCheckedTreeNodeAll" />
                            全部展开/折叠:
                            <el-switch v-model="menuExpand" active-text="展开" inactive-text="折叠" inline-prompt
                                @change="handleCheckedTreeExpand" />
                            父子联动(选中父节点，自动选择子节点):
                            <el-switch v-model="checkStrictly" active-text="是" inactive-text="否" inline-prompt />

                        </template>
                        <el-tree ref="treeRef" empty-text="加载中，请稍后" :check-strictly="!checkStrictly" show-checkbox
                            highlight-current node-key="id" :data="deptList" />
                    </el-card>
                </el-form-item>

            </el-form>

            <template #footer>
                <el-divider />
                <span class="dialog-footer">
                    <el-button type="primary" @click="submit">
                        提交
                    </el-button>
                </span>
            </template>

        </el-dialog>
    </div>
</template>

<style lang='scss' scoped>
.cardHeight {
    width: 100%;
    max-height: 400px;
    overflow-y: scroll;
}
</style>