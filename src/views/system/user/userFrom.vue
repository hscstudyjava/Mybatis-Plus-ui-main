<script lang='ts' setup>
import { onMounted, reactive, ref } from 'vue';
import { parseTime } from '@/utils/common'
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import type { SimpleTree, SysDept, SysPost, SysUser } from '@/api/system/type';
import { insertUser, updateUser, getUserOnce, type SysUserReq } from '@/api/system/user'
import { validateEmail, validateTelPhone } from '@/utils/verify/formVerify';
//------------------------基础模板-------------------------------------------------
defineOptions({ name: 'userFrom' })


const props = withDefaults(
    defineProps<{
        deptList: SimpleTree<SysDept>[],
        postList: SysPost[]
    }
    >(),
    {
    }
)
const diologOpen = ref(false)
const diologTitle = ref('')
const loading = ref(false)
const type = ref('')


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
const ruleFormRef = ref()
const rulues = reactive({

    userName: [
        { message: '用户账号必须填写', trigger: 'blur', required: true }
    ],

    userNickName: [
        { message: '用户昵称必须填写', trigger: 'blur', required: true }
    ],

    createDept: [
        { message: '用户必须绑定部门', trigger: 'blur', required: true }
    ],

    passWord: [
        { message: '用户密码必须填写', trigger: 'blur', required: true }
    ],

    sex: [
        { message: '用户性别必须填写', trigger: 'blur', required: true }
    ],

    telPhone: [
        { validator: validateTelPhone, trigger: 'blur', required: true }
    ],

    userEmil: [
        { validator: validateEmail, trigger: 'blur', required: true }
    ],

    postIdList: [
        {
            type: 'array',
            required: true,
            message: '请给用户一个岗位',
            trigger: 'change',
        },
    ]




})

const resetFrom = () => {
    Object.assign(from, {
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
    ruleFormRef.value?.resetFields()
}


const open = (type: string, id: number) => {
    diologOpen.value = true
    diologTitle.value = type === 'create' ? '新增用户' : '修改用户'
    resetFrom();

    if(id){
        loading.value=true;
        getUserOnce(id).then(res=>{
            Object.assign(from,res.data)
            loading.value=false
        })
    }

}
const emit = defineEmits(['success'])
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 
 * 新增
 */
const submit = async () => {
    // 校验表单
    if (!ruleFormRef) {
        return;
    }
    const valid = await ruleFormRef.value.validate()
    if (!valid) return
    try {
        if (from.userId) {
            const { msg } = await updateUser(from)
            messages.success(msg)
        } else {
            const { msg } = await insertUser(from)
            messages.success(msg)
        }
        diologOpen.value = false
        emit('success')
    } catch (error: any) {
        messages.error(error.msg)
    }
    finally {
        loading.value = false
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

        <el-form ref="ruleFormRef" :model="from" :rules="rulues" status-icon label-width="80px">
            <el-row>

                <el-col :span="12">
                    <el-form-item label="账号信息" prop="userName">
                        <el-input v-model="from.userName" placeholder="请填写用户账号" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="所属部门" prop="createDept">
                        <el-tree-select 
                        placeholder="请选择所属部门"
                        style="width:100%" v-model="from.createDept" node-key="id" :data="deptList"
                            check-strictly :render-after-expand="false" />
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="用户昵称" prop="userNickName">
                        <el-input v-model="from.userNickName" placeholder="请填写用户昵称" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12"  v-if="from.userId===undefined">
                    <el-form-item label="用户密码" prop="passWord" >
                        <el-input v-model="from.passWord" placeholder="请填写用户密码" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="手机号码" prop="telPhone">
                        <el-input v-model="from.telPhone" placeholder="请填写手机号码" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="联系邮箱" prop="userEmil">
                        <el-input v-model="from.userEmil" placeholder="请填写联系邮箱" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="用户性别" prop="sex">
                        <el-select v-model="from.sex" placeholder="请选择用户性别" class="w-full">
                            <el-option v-for="item in getDictOptions(DICT_TYPE.USER_SEX)" :key="item.value"
                                :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="所属岗位" prop="postIdList">
                        <el-select v-model="from.postIdList" multiple placeholder="请选择所属岗位" class="w-full">
                            <el-option v-for="item in postList" :key="item.id" :label="item.postName" :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>





            </el-row>

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