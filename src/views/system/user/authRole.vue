<script lang='ts' setup>
import { reactive, ref } from 'vue';
import { parseTime } from '@/utils/common'
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import type { SysRole } from '@/api/system/type';
import { authUserRole, getUserOnce, type SysUserReq } from '@/api/system/user';
//------------------------基础模板-------------------------------------------------
defineOptions({ name: 'authRole' })

const diologOpen = ref(false)
const diologTitle = ref('')
const loading = ref(false)

const props = withDefaults(
    defineProps<{
        roleList: SysRole[]
    }>(),
    {}
)

const from = reactive<SysUserReq>({
    userId: undefined,
    createDept: undefined,
    userName: '',
    passWord: '',
    userNickName: '',
    telPhone: '',
    userEmil: '',
    createTime: undefined,
    updateTime: undefined,
    sortValue: 0,
    sex: "",
    postIdList: [],
    roleIdList: []
})

const open = (userId: number) => {
    loading.value = true
    getUserOnce(userId).then(res => [
        Object.assign(from, res.data),
        diologOpen.value = true,
        loading.value = false
    ]).catch((error) => {
        loading.value = false
    })
}
const emit = defineEmits(['success'])
defineExpose({ open })

const submit = async () => {
    try{
        await authUserRole(from.userId!!,from.roleIdList!!)
        diologOpen.value = false,
        emit('success')
    }catch(error:any){
        messages.error(error?.msg)
    }
}
</script>
<template>
    <el-dialog v-model="diologOpen" :close-on-click-modal="false" :draggable="true" :align-center="true" width="50%">
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <h6 :id="titleId">{{ diologTitle }}</h6>
                <el-divider />
            </div>
        </template>

        <el-form :model="from" status-icon label-width="80px">

                <el-form-item label="账号信息" prop="userName">
                    <el-input v-model="from.userName" 
                    disabled
                    placeholder="请填写用户账号" clearable></el-input>
                </el-form-item>

                <el-form-item label="用户昵称" prop="userNickName">
                    <el-input v-model="from.userNickName" 
                    disabled
                    
                    placeholder="请填写用户昵称" clearable></el-input>
                </el-form-item>

                <el-form-item label="授权角色" prop="postIdList">
                    <el-select v-model="from.roleIdList" multiple placeholder="请选择授权角色" class="w-full">
                        <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName"
                            :value="item.roleId" />
                    </el-select>
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
</template>

<style lang='scss' scoped></style>