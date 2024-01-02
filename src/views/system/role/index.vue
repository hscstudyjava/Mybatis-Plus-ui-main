
<template>
    <div class="app-context">
        <el-card>

            <!-- 表单 -->
            <el-form :inline="true" :model="params" class="demo-form-inline" @submit.native.prevent>
                <el-form-item label="角色名称">
                    <el-input v-model="params.roleName" placeholder="请输入角色名称" @keyup.enter.native="queryPage" clearable />
                </el-form-item>

                <el-form-item label="角色字符">
                    <el-input v-model="params.roleKey" placeholder="请输入角色字符" @keyup.enter.native="queryPage" clearable />
                </el-form-item>

                <!--  <el-form-item label="删除状态">
                <el-switch v-model="params.isDeleted" active-value="1" inactive-value="0" class="ml-2" @change="queryPage"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
            </el-form-item> -->

                <el-form-item>
                    <el-button type="primary" @click="queryPage">查询</el-button>
                    <el-button @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <!-- 表单数组 -->
            <el-row :gutter="10" class="mb8">

                <el-col :span="1.5" v-peri="['system:role:save']">
                    <el-button type="success" plain @click="handleInsert(ruleFormRef)">
                        <template #icon>
                            <el-icon>
                                <i-ep-Plus />
                            </el-icon>
                        </template>
                        新增
                    </el-button>
                </el-col>

                <el-col :span="1.5" v-peri="['system:role:update']">
                    <el-button type="primary" plain :disabled="selectObj.single" @click="hadnleUpdate(undefined)">
                        <template #icon>
                            <el-icon>
                                <i-ep-Edit />
                            </el-icon>
                        </template>
                        更新
                    </el-button>
                </el-col>

                <el-col :span="1.5" v-peri="['system:role:remove']">
                    <el-button type="danger" :disabled="selectObj.multiple" @click="removeRole()" plain>
                        <template #icon>
                            <i-ep-delete />
                        </template>
                        删除
                    </el-button>
                </el-col>

                <el-col :span="1.5" v-peri="['system:role:download']">
                    <el-button type="warning" plain>
                        <template #icon>
                            <i-ep-Download />
                        </template>
                        下载</el-button>
                </el-col>

            </el-row>
        </el-card>


        <el-card class="mt-10">
            <!-- 表格 -->
            <el-table :data="objList.records" row-key="roleId" v-loading="loading" stripe
                @selection-change="handleSelectionChange" style="width: 100%">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column prop="roleId" label="ID" align="center" />
                <el-table-column prop="roleName" label="角色名称" align="center" />
                <el-table-column prop="roleKey" label="角色字符" align="center" />
                <el-table-column prop="createTime" label="创建时间" align="center" />
                <el-table-column prop="updateTime" label="更新时间" align="center" />
                <el-table-column prop="status" label="角色状态" align="center" />
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <div class="flex items-center justify-center">
                            <el-button link v-peri="['system:role:update']" type="primary"
                                @click="hadnleUpdate(scope.row.roleId)">
                                <template #icon>
                                    <el-icon>
                                        <i-ep-Edit />
                                    </el-icon>
                                </template>
                                更新
                            </el-button>

                            <el-button link type="danger" v-peri="['system:role:remove']" @click="removeRole(scope.row)">
                                <template #icon>
                                    <i-ep-delete />
                                </template>
                                删除
                            </el-button>


                            <el-dropdown @command="handleCommand($event, scope.row)" teleported>
                                <el-button link type="primary">
                                    <el-icon class="el-icon--right">
                                        <svg-icon icon="ep:arrow-down-bold"></svg-icon>
                                    </el-icon>
                                    更多
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>

                                        <el-dropdown-item command="auth-peri"
                                            v-if="auth().hasPermiOr([`system:role:role-assign-permission`])">权限授权</el-dropdown-item>


                                        <el-dropdown-item command="auth-dept"
                                            v-if="auth().hasPermiOr([`system:role:role-assign-dept`])">数据授权</el-dropdown-item>


                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>

                        </div>

                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <!-- <Paginations :limit.sync="params.pageSize" :pageNum.sync="params.pageNumer" :total="objList.totalRow" @paginations="queryPage"> -->
            <Paginations v-show="objList.totalRow > 0" :limit="params.pageSize" :pageNum="params.pageNumber"
                :total="objList.totalRow" @paginations="queryPage">
            </Paginations>
        </el-card>



        <!-- 弹窗 -->
        <el-dialog v-model="openDialog" :title="title" :close-on-click-modal="false" :draggable="true" :align-center="true"
            width="30%">
            <el-form ref="ruleFormRef" :model="form" :rules="rules" status-icon label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="form.roleName" placeholder="请填写角色名称" />
                </el-form-item>

                <el-form-item label="数据权限" prop="dataScope">
                    <!-- <el-input v-model="form.roleName" placeholder="请填写角色名称" /> -->
                    <el-select v-model="form.dataScope" placeholder="请选择数据权限" class="w-full">
                        <el-option v-for="item in getDictOptions(DICT_TYPE.SYSTEM_DATA_PERMISSION)" :key="item.value"
                            :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item prop="roleKey">
                    <template #label>
                        <span>角色字符
                            <el-tooltip placement="top">
                                <template #content>角色字符用于权限管理 请您必须填写</template>
                                <svg-icon iconClass="question"></svg-icon>
                            </el-tooltip>
                        </span>
                    </template>
                    <el-input v-model="form.roleKey" placeholder="请填写角色字符" />
                </el-form-item>

                <el-form-item label="角色状态">
                    <el-switch v-model="form.status" />
                </el-form-item>

                <el-form-item label="排序值">
                    <el-input-number v-model="form.sortValue" :min="0" :max="100" controls-position="right"
                        style="width: 100%;" />
                </el-form-item>



                <el-form-item label="备注">
                    <el-input v-model="form.remark" autosize type="textarea" placeholder="请输入备注" />
                </el-form-item>




            </el-form>



            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="openDialog = false">取消</el-button>
                    <el-button type="primary" @click="submit(ruleFormRef)">
                        提交
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </div>

    <AuthPeriFrom ref="authPeri" @success="queryPage" :permission-list="simplePer"></AuthPeriFrom>

    <AuthDeptFrom ref="authDept" @success="queryPage" :dept-list="simpleDept"></AuthDeptFrom>
</template>
    
<script setup lang="ts" name="SystemRole">
import { DICT_TYPE, getStrDictOptions, getDictOptions } from '@/utils/common/dict'
// @ts-ignore
import { reactive, onMounted, ref, toRefs } from 'vue';
import type { SysRole, Page, SimpleTree, SysPermisson, SysDept } from '@/api/system/type';
// @ts-ignore
import { insertRole, queryRoleById, queryRolePage, removeRoleByIds, updateRole } from '@/api/system/role';
import { messages, confirms } from "@/utils/message/MessageUtils"
import type { FormInstance, FormRules } from 'element-plus';
import { auth } from '@/hooks/web/auth';

import { selectSysDeptSimpleList } from '@/api/system/dept';
import { queryPermissionSimple } from '@/api/system/permission';

import AuthPeriFrom from './authPeriFrom.vue';
import AuthDeptFrom from './authDeptFrom.vue';
const objList: Page<SysRole> = reactive<Page<SysRole>>({
    totalRow: 0,
    records: [] as Array<SysRole>,
    pageNumer: 1,
    pageSize: 0,
    totalPage: 0
})

const simplePer = ref<SimpleTree<SysPermisson>[]>([])
const simpleDept = ref<SimpleTree<SysDept>[]>([])

const authPeri = ref()
const authDept = ref()


const openDialog = ref<Boolean>(false);
const loading = ref<Boolean>(false);
const title = ref<String>('')
const params = reactive({
    roleId: null,
    roleName: '',
    roleKey: '',
    isDeleted: 0,
    status: '',
    createTime: null,
    updateTime: null,
    createBy: '',
    updateBy: '',
    remark: '',
    pageNumber: 1,
    pageSize: 10
})
var form: SysRole = reactive<SysRole>({
    roleId:undefined,
    roleName: '',
    roleKey: '',
    status: '',
    remark: '',
    sortValue: 0,
    dataScope: ''
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<typeof form>>({
    roleName: [
        { message: '角色名称必填', trigger: 'blur', required: true },
        { min: 2, max: 12, message: '角色名称长度 2 - 12之间', trigger: 'blur' }
    ],

    roleKey: [
        { message: '角色字符必填', trigger: 'blur', required: true },
        { min: 2, max: 12, message: '角色字符长度 2 - 12之间', trigger: 'blur' }
    ],

})



const handleCommand = (type: string, row: SysRole) => {

    switch (type) {

        case 'auth-peri':
            openAuthPeri(row.roleId!!)
            break
        case 'auth-dept':
            openAuthDept(row.roleId!!)
            break

    }
}
const openAuthPeri = async (roleId: number) => {
    try {
        await loadingAuthList();
        authPeri.value.open(roleId)
    } catch (error) {

    }
}

const openAuthDept = async (roleId: number) => {
    try {
        await loadingAuthList();
        authDept.value.open(roleId)
    } catch (error) {

    }
}

const loadingAuthList = async () => {
    try {
        const requests = [
            selectSysDeptSimpleList({}),
            queryPermissionSimple({} as SysPermisson)
        ];
        const [deptResponse, periResponse] = await Promise.all(requests);
        simpleDept.value = deptResponse.data as SimpleTree<SysDept>[];
        simplePer.value = periResponse.data as SimpleTree<SysPermisson>[];
    } catch (error: any) {

    }
}

var selectObj = reactive({
    /** 
     * 编号数组
     */
    ids: [],
    /** 
     * 单个
     */
    single: true,
    /** 
     * 多个
     */
    multiple: true
})
const handleSelectionChange = (rows?: SysRole[]) => {
    // @ts-ignore
    selectObj.ids = rows?.map(item => item.roleId)
    selectObj.single = selectObj.ids.length != 1
    selectObj.multiple = !selectObj.ids.length
}

const queryPage = (value?: any) => {
    // 重新修改后
    if (value != null) {
        Object.assign(params, value)
    }
    loading.value = true
    queryRolePage(params).then(res => {
        objList.records = res.data.records
        objList.totalRow = res.data.totalRow
        loading.value = false
    })
}
const resetQuery = () => {
    Object.assign(params, {
        roleId: null,
        roleName: '',
        roleKey: '',
        isDeleted: 0,
        status: '',
        createTime: null,
        updateTime: null,
        createBy: '',
        updateBy: '',
        remark: '',
        pageNumber: 1,
        pageSize: 10
    });
    queryPage();
}

const hadnleUpdate = (roleId: number | undefined) => {
    let id: number = roleId || selectObj.ids[0]
    queryRoleInfo(id).then(data => {
        title.value = "更新角色"
        openDialog.value = true;
        Object.assign(form, data)
    })
}
async function queryRoleInfo(roleId: number): Promise<SysRole> {
    return (await queryRoleById(roleId)).data
}

const removeRole = (role?: SysRole | undefined) => {
    confirms.confirm(`您是否删除当前角色:${role?.roleName || selectObj.ids}`)
        .then(res => {
            removeRoleByIds(role?.roleId || selectObj.ids).then(res => {
                messages.success(res.msg)
                queryPage();
            })
        })
}

const handleInsert = (formEl: FormInstance | undefined) => {
    openDialog.value = true;
    title.value = "新增角色"
    resetFormRule(formEl);// 清空表单
}

// 提交表单
const submit = (formEl: FormInstance | undefined) => {
    if (!formEl) return false
    formEl.validate((valid) => {
        if (!valid) {
            return false
        }
        if (form.roleId) {
            updateRole(form).then(response => {
                queryPage();
                openDialog.value = false;
            }).catch(error => {
                openDialog.value = false;
                messages.error(error.msg || '系统接口异常 请联系管理员')
            })
            return
        } else {
            // 新增
            insertRole(form).then(response => {
                queryPage();
                openDialog.value = false;
            }).catch(error => {
                openDialog.value = false;
                messages.error(error.msg || '系统接口异常 请联系管理员')
            })

        }

    })



}

const resetFormRule = (formEl?: FormInstance | undefined) => {
    // 重新赋值
    Object.assign(form, {
        id: undefined,
        roleName: '',
        roleKey: '',
        status: '',
        remark: '',
        sortValue: 0,
        dataScope: ''
    })
    if (!formEl) return
    formEl.resetFields()
}

onMounted(() => {
    queryPage()
})
</script>