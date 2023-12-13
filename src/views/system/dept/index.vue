<template>
    <div class="app-context">
        <!-- 表单数组 -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5" v-peri="[basePeri + 'save']">
                <!-- @click="handleInsert(ruleFormRef)" -->
                <el-button type="success" plain @click="handleInsert()">
                    <template #icon>
                        <el-icon>
                            <i-ep-Plus />
                        </el-icon>
                    </template>
                    新增
                </el-button>
            </el-col>

            <el-col :span="1.5">
                <el-button type="warning" plain @click="toggleExpansion()">
                    <template #icon>
                        <i-ep-Switch />
                    </template>
                    展开</el-button>
            </el-col>

            <el-col>
                <rightQuery :query="state.showQuery" @toggleQuery="toggleQuery" @refresh="loadList" />
            </el-col>
        </el-row>

        <el-table ref="treeTableRef" stripe border :data="state.list" style="width: 100%" row-key="id" lazy
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column prop="deptName" show-overflow-tooltip align="center" label="部门名称" />
            <el-table-column prop="leader" show-overflow-tooltip align="center" label="负责人" />
            <el-table-column prop="phoneNumber" show-overflow-tooltip align="center" label="手机号码" />
            <el-table-column prop="simpleChinesePinyin" align="center" show-overflow-tooltip label="缩写拼音" />
            <el-table-column prop="email" align="center" show-overflow-tooltip label="邮箱" />
            <el-table-column label="操作" align="center" width="200px">
                <template #default="socpe">
                    <el-button link v-peri="[`${basePeri}save`]" type="success" @click="handleSave(socpe.row.id)">
                        <template #icon>
                            <el-icon>
                                <i-ep-plus />
                            </el-icon>
                        </template>
                        新增
                    </el-button>

                    <el-button link v-peri="[`${basePeri}update`]" @click="handleUpdate(socpe.row.id)" type="primary">
                        <template #icon>
                            <el-icon>
                                <i-ep-Edit />
                            </el-icon>
                        </template>
                        更新
                    </el-button>

                </template>
            </el-table-column>
        </el-table>

        <!--新增OR更新 -->
        <el-dialog v-model="state.open" :title="state.title" width="50%">
            <el-form :model="state.form" :rules="rules" ref="ruleFormRef" status-icon label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上级部门">
                            <el-tree-select style="width:100%" v-model="state.form.parentId" node-key="id"
                                :data="state.simpleList" check-strictly :render-after-expand="false" />
                        </el-form-item>
                    </el-col>

                    <el-col :span=12>
                        <el-form-item prop="deptName" label="部门名称">
                            <el-input v-model="state.form.deptName" placeholder="请填写部门名称" clearable />
                        </el-form-item>
                    </el-col>

                    <el-col :span=12>
                        <el-form-item prop="leader" label="负责人">
                            <el-input v-model="state.form.leader" placeholder="请填写部门负责人" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item prop="phoneNumber" label="手机号">
                            <el-input v-model="state.form.phoneNumber" placeholder="请填写部门负责人手机号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item prop="email" label="邮箱">
                            <el-input v-model="state.form.email" placeholder="请填写部门邮箱" clearable />
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>

            <template #footer>
                <span class="dialog-footer">

                    <el-button @click="cancel(ruleFormRef)">
                        <template #icon>
                            <el-icon>
                                <i-ep-Refresh />
                            </el-icon>
                        </template>
                        取消
                    </el-button>

                    <el-button type="primary" @click="submit">
                        <template #icon>
                            <el-icon>
                                <i-ep-Pointer />
                            </el-icon>
                        </template>
                        提交
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script  setup lang="ts" >
import { selectSysDeptList, selectSysDeptSimpleList, insertSysDept, updateSysDept, getSysDeptById, removeSysDept, basePeri } from '@/api/system/dept';

import type { SimpleTree, SysDept } from '@/api/system/type';
import { messages } from '@/utils/message/MessageUtils';
import type { FormInstance, FormRules, TableInstance } from 'element-plus';
import type form from 'element-plus/es/components/form/index.mjs';
import { onMounted, reactive, ref } from 'vue';
const treeTableRef = ref<TableInstance>();//注册
const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules<typeof form>>({
    deptName: [
        { message: '部门名称必填', trigger: 'blur', required: true },
        { min: 2, max: 12, message: '部门名称长度 2 - 12之间', trigger: 'blur' }
    ],

    leader: [
        { message: '负责人必须填写', trigger: 'blur', required: true },
    ],

})

const state = reactive({

    showQuery: false,

    expandAll: false,

    loading: false,

    open: false,

    title: '',

    list: [] as Array<SysDept>,

    simpleList: [] as Array<SimpleTree<SysDept>>,

    params: {},

    form: {
        id: "",
        parentId: null,
        deptName: '',
        email: '',
        phoneNumber: '',
        leader: '',
        status: ''
    } as SysDept


})

const loadList = () => {
    state.loading = true
    selectSysDeptList(state.params).then(res => {
        state.list = res.data
        state.loading = false
    })
}

const loadSimpleList = () => {
    // 重置数据
    state.simpleList = [];
    selectSysDeptSimpleList(state.params).then(res => {
        let parentObj: SimpleTree<SysDept> = {
            id: '0',
            parentId: '',
            label: '主类目',
            children: [] as Array<SysDept>
        }
        // @ts-ignore
        parentObj.children = res.data;
        state.simpleList.push(parentObj)
    })
}

const toggleQuery = () => {
    state.showQuery = !state.showQuery
}

// @ts-ignore
const TabData = (data: Array<SysDept>, status: boolean) => {  //循环数据赋值
    data.forEach((i) => {
        treeTableRef.value.toggleRowExpansion(i, status)
        if (i.children) {
            forArr(i.children, status);
        }
    });
}

// @ts-ignore
const forArr = (arr: Array<SysDept>, status: boolean) => {     //关闭展开逻辑
    arr.forEach((i) => {
        treeTableRef.value.toggleRowExpansion(i, status)
        if (i.children) {
            forArr(i.children, status);
        }
    });
};

const toggleExpansion = () => {   //展开
    // 重新赋值给expandAll
    state.expandAll = !state.expandAll
    TabData(state.list, state.expandAll);
}

const handleInsert = (id: string = "0", formEl?: FormInstance | undefined) => {
    state.open = true;
    state.title = "新增角色"
    resetFormRule(formEl);// 清空表单
    state.form.parentId = id
}

const handleUpdate = (id: string, formEl: FormInstance | undefined) => {
    state.open = true;
    state.title = "更新角色"
    getSysDeptById(id).then(res => {
        resetFormRule(formEl);// 清空表单
        Object.assign(state.form,res.data)
    }).catch(e=>{
        state.open = false;
    })
}

const cancel = (formEl?: FormInstance | undefined) => {
    state.open = false;
    resetFormRule(formEl)
}

const submit = () => {
    if (state.form.id) {
        updateSysDept(state.form).then(res => {
            messages.success(res.msg)
            state.open = false;
            loadList()
            loadSimpleList();
        }).catch(error => {
            messages.error(error.msg)
            state.open = false;
        })
    } else {
        insertSysDept(state.form).then(res => {
            messages.success(res.msg)
            state.open = false;
            loadList();
            loadSimpleList();
        }).catch(error => {
            messages.error(error.msg)
            state.open = false;
        })
    }

}

const resetFormRule = (formEl?: FormInstance | undefined) => {
    // 重新赋值
    Object.assign(state.form, {
        id: "",
        parentId: null,
        deptName: '',
        email: '',
        phoneNumber: '',
        leader: '',
        status: '0'
    })
    if (!formEl) return
    formEl.resetFields()
}

onMounted(() => {
    loadList()
    loadSimpleList()
})
</script>