
<template>
    <div class="app-context">
        <!-- 表单 -->
        <el-form :inline="true" :model="params" class="demo-form-inline" @submit.native.prevent>
            <el-form-item label="角色名称">
                <el-input v-model="params.roleName" placeholder="请输入角色名称" @keyup.enter.native="queryPage" clearable />
            </el-form-item>

            <el-form-item label="角色字符">
                <el-input v-model="params.roleKey" placeholder="请输入角色字符" @keyup.enter.native="queryPage" clearable />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="queryPage">查询</el-button>
            </el-form-item>
        </el-form>

        <!-- 表单数组 -->
        <el-row :gutter="10" class="mb8">

            <el-col :span="1.5" v-peri="['system:role:add']">
                <el-button type="success" plain @click="handleInsert">
                    <template #icon>
                        <el-icon>
                            <i-ep-Plus />
                        </el-icon>
                    </template>
                    新增
                </el-button>
            </el-col>

            <el-col :span="1.5" v-peri="['system:role:update']">
                <el-button type="primary" plain>
                    <template #icon>
                        <el-icon>
                            <i-ep-Edit />
                        </el-icon>
                    </template>
                    更新
                </el-button>
            </el-col>

            <el-col :span="1.5" v-peri="['system:role:remove']">
                <el-button type="danger" plain>
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


        <!-- 表格 -->
        <el-table :data="objList.records" v-loading="loading" style="width: 100%">
            <el-table-column prop="roleId" label="ID" />
            <el-table-column prop="roleName" label="角色名称" />
            <el-table-column prop="roleKey" label="角色字符" />
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="updateTime" label="更新时间" />
            <el-table-column prop="status" label="角色状态" />
        </el-table>

        <!-- 分页 -->
        <!-- <Paginations :limit.sync="params.pageSize" :pageNum.sync="params.pageNumer" :total="objList.totalRow" @paginations="queryPage"> -->
        <Paginations v-show="objList.totalRow > 0" :limit="params.pageSize" :pageNum="params.pageNumber"
            :total="objList.totalRow" @paginations="queryPage">
        </Paginations>

        <!-- 弹窗 -->
        <el-dialog
         v-model="openDialog"
         :title="title" 
         :close-on-click-modal="false"
         :draggable="true"
         :align-center="true"
         width="50%"
        >

            <button v-copy="123123">复制</button>
            
            
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="openDialog = false">取消</el-button>
                    <el-button type="primary" @click="openDialog = false">
                        提交
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>
    
<script setup lang="ts">
// @ts-ignore
import { useUserStore } from '@/stores/user';
import { reactive, onMounted, ref } from 'vue';
import type { SysRole, Page } from '@/api/system/type';
// @ts-ignore
import { queryRolePage } from '@/api/system/role';
const userStore = useUserStore()
import { messages, notify } from "@/utils/message/MessageUtils"

const objList: Page<SysRole> = reactive<Page<SysRole>>({
    totalRow: 0,
    records: [] as Array<SysRole>,
    pageNumer: 1,
    pageSize: 0,
    totalPage: 0
})

const openDialog=ref<Boolean>(false);
const loading = ref<Boolean>(false);
const title=ref<String>('')

const params = reactive({
    roleId: null,
    roleName: '',
    roleKey: '',
    isDeleted: false,
    status: '',
    createTime: null,
    updateTime: null,
    createBy: '',
    updateBy: '',
    remark: '',
    pageNumber: 1,
    pageSize: 10
})




const queryPage = (value?: any) => {
    // 重新修改后
    if (value != null) {
        params.pageNumber = value.pageNum;
        params.pageSize = value.limit;
    }
    loading.value = true
    queryRolePage(params).then(res => {
        objList.records = res.data.records
        objList.totalRow = res.data.totalRow
        loading.value = false
    })
}

const handleInsert=()=>{
    openDialog.value=true;
    title.value="新增角色"
}


onMounted(() => {
    queryPage()
})
</script>