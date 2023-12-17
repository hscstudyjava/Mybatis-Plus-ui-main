
<template>
    <div class="app-context">

        <el-card class="box-card">
            <el-form :inline="true" v-show="state.showQuery" :model="state.params" @submit.native.prevent>

                <el-form-item label="模板标题">
                    <el-input v-model="state.params.templateTitle" placeholder="请输入用户模板标题" @keyup.enter.native="loadList"
                        clearable></el-input>
                </el-form-item>

                <el-form-item label="模板字符">
                    <el-input v-model="state.params.templateCode" placeholder="请输入用户模板字符" @keyup.enter.native="loadList"
                        clearable></el-input>
                </el-form-item>

                <el-form-item label="模板类型">
                    <el-input v-model="state.params.templateType" placeholder="请输入模板类型字符" @keyup.enter.native="loadList"
                        clearable></el-input>
                </el-form-item>

                <el-form-item label="发送人">
                    <el-input v-model="state.params.nickName" placeholder="请输入发送人字符" @keyup.enter.native="loadList"
                        clearable></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="loadList">
                        <template #icon>
                            <i-ep-search />
                        </template>
                        查询</el-button>
                    <el-button @click="resetForm">
                        <template #icon>
                            <i-ep-Refresh />
                        </template>
                        重置</el-button>
              
                </el-form-item>
            </el-form>

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

                <el-col :span="1.5" v-peri="[basePeri + 'update']">
                    <el-button type="primary" plain :disabled="state.single" @click="handleUpdate(undefined, ruleFormRef)">
                        <template #icon>
                            <el-icon>
                                <i-ep-Edit />
                            </el-icon>
                        </template>
                        更新
                    </el-button>
                </el-col>

                <el-col :span="1.5" v-peri="[basePeri + 'remove']">
                    <el-button type="danger" :disabled="state.multiple" @click="handleDelete()" plain>
                        <template #icon>
                            <i-ep-delete />
                        </template>
                        删除
                    </el-button>
                </el-col>

                <rightQuery 
                style="float: right;"
                :query="state.showQuery" @toggleQuery="toggleQuery" @refresh="loadList" />
            </el-row>
        </el-card>

        <el-card class="mt-10">
            <el-table :data="state.list" v-loading="state.loading" @selection-change="handleSelectionChange" stripe
                style="width: 100%">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="ID" prop="id" align="center" />
                <el-table-column label="模板编码" show-overflow-tooltip prop="templateCode" align="center" />
                <el-table-column label="模板标题" show-overflow-tooltip prop="templateTitle" align="center" />
                <el-table-column label="发送昵称" show-overflow-tooltip prop="nickName" align="center" />
                <el-table-column label="模板内容" show-overflow-tooltip prop="templateContext" align="center" />
                <el-table-column label="排序" prop="sortValue" align="center" />
                <el-table-column label="创建时间" align="center" prop="createTime" />
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button link v-peri="[`${basePeri}update`]" type="primary"
                            @click="handleUpdate(scope.row.id, ruleFormRef)">
                            <template #icon>
                                <el-icon>
                                    <i-ep-Edit />
                                </el-icon>
                            </template>
                            更新
                        </el-button>

                        <el-button link type="danger" v-peri="[`${basePeri}:remove`]" @click="handleDelete(scope.row)">
                            <template #icon>
                                <i-ep-delete />
                            </template>
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <Paginations v-show="state.total > 0" :limit="state.params.pageSize" :pageNum="state.params.pageNumber"
                :total="state.total" @paginations="loadList">
            </Paginations>
        </el-card>

        <!-- 弹窗 -->
        <el-dialog v-model="state.open" :title="state.title" :close-on-click-modal="false" :draggable="true"
            :align-center="true" width="50%">
            <el-form ref="ruleFormRef" :model="state.form" :rules="rules" status-icon label-width="100px">
                <el-form-item label="模板标题" prop="templateTitle">
                    <el-input v-model="state.form.templateTitle" placeholder="请输入模板标题" clearable></el-input>
                </el-form-item>

                <el-form-item prop="templateCode">
                    <template #label>
                        <span>
                            模板字符
                            <el-tooltip placement="top">
                                <template #content>模板字符用于保存至缓存:(system_notice_template)</template>
                                <svg-icon iconClass="question"></svg-icon>
                            </el-tooltip>
                        </span>
                    </template>
                    <el-input v-model="state.form.templateCode" placeholder="请输入模板字符" clearable></el-input>
                </el-form-item>

                <el-form-item prop="templateContext">
                    <template #label>
                        <span>
                            模板内容
                            <el-tooltip placement="top">
                                <template #content>模板内容用于注入信息:(你好,{userName}先生/女士)=>{你好,张三先生/女士}</template>
                                <svg-icon iconClass="question"></svg-icon>
                            </el-tooltip>
                        </span>
                    </template>
                    <el-input v-model="state.form.templateContext" placeholder="请输入模板内容"
                        :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" clearable></el-input>
                </el-form-item>

                <el-form-item label="模板类型" prop="templateType">
                    <el-input v-model="state.form.templateType" placeholder="请输入模板类型" clearable></el-input>
                </el-form-item>

                <el-form-item label="发送人" prop="nickName">
                    <el-input v-model="state.form.nickName" placeholder="请输入发送人字符" clearable></el-input>
                </el-form-item>

                <el-form-item label="备注" prop="remark">
                    <el-input v-model="state.form.remark" placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 4 }"
                        type="textarea" clearable></el-input>
                </el-form-item>

            </el-form>



            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="submit(ruleFormRef)">
                        提交
                    </el-button>
                </span>
            </template>
        </el-dialog>


    </div>
</template>

<script setup lang="ts">
import {
    selectSysNoticeTemplateList,
    insertSysNoticeTemplate,
    updateSysNoticeTemplate,
    getSysNoticeTemplateId,
    removeSysNoticeTemplate,
    basePeri
}
    from '@/api/system/notice/template.ts';
import { useDark, useToggle } from '@vueuse/core'
import { onMounted, reactive, ref } from 'vue';
import type { SysNoticeTemplate } from '@/api/system/type';
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import type { FormInstance, FormRules } from 'element-plus';

const isDark = useDark()
const toggleDark = useToggle(isDark)
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<typeof form>>({
    templateTitle: [
        { message: '模板标题必须填写', trigger: 'blur', required: true },
        { min: 2, max: 200, message: '模板标题长度 2 - 200之间', trigger: 'blur' }
    ],

    templateCode: [
        { message: '模板字符必须填写', trigger: 'blur', required: true },
    ],

    templateContext: [
        { message: '模板内容必须填写', trigger: 'blur', required: true },
    ]
})
const state = reactive({

    single: true,

    multiple: true,

    showQuery: true,

    expandAll: false,

    loading: false,

    open: false,

    title: '',

    ids: [],

    list: [] as Array<SysNoticeTemplate>,

    total: 0,

    params: {
        templateTitle: undefined,
        templateCode: undefined,
        templateType: undefined,
        nickName: undefined,
        pageNumber: 1,
        pageSize: 10
    },

    form: {
        id: undefined,
        templateTitle: undefined,
        templateCode: undefined,
        templateType: undefined,
        templateContext: undefined,
        nickName: undefined,
        status: "0",
        sortValue: 0,
        remark: undefined,
        templateParams:undefined,
    } 


})

const loadList = (value?: any) => {
    if (value != null) Object.assign(state.params, value)
    state.loading = true
    selectSysNoticeTemplateList(state.params).then(res => {
        state.list = res.data.records
        state.total = res.data.totalRow
        state.loading = false
    })
}

const handleInsert = (formEl?: FormInstance | undefined) => {
    state.open = true;
    state.title = "新增模板"
    resetFormRule(formEl);// 清空表单
}

const handleUpdate = (id: string, formEl: FormInstance | undefined) => {
    state.open = true;
    state.title = "更新角色"
    const currnetId = id || state.ids;
    getSysNoticeTemplateId(currnetId).then(res => {
        resetFormRule(formEl);// 清空表单
        Object.assign(state.form, res.data)
    }).catch(e => {
        state.open = false;
    })
}

const handleDelete = (row?: SysNoticeTemplate) => {
    if (row.id) {
        confirms
            .confirm(`您是否删除${row.templateTitle}消息模板数据?`)
            .then((res) => {
                removeSysNoticeTemplate(row.id).then((res) => {
                    loadList();
                });
            })
    } else {
        confirms
            .confirm(`您是否删除${state.ids}这些数据?`)
            .then((res) => {
                removeSysNoticeTemplate(state.ids).then((res) => {
                    loadList();
                });
            })
    }
}


const submit = () => {
    if (!ruleFormRef) return
    ruleFormRef.value?.validate(v => {
        if (!v) {
            notify.error('系统提示', '抱歉您无法提交表单')
            return
        }
        if (state.form.id) {
            updateSysNoticeTemplate(state.form)
                .then(res => {
                    messages.success(res.msg)
                    state.open = false;
                    loadList()
                }).catch(error => {
                    // messages.error(error.msg)
                    loadList()
                    // state.open = false;
                })
        } else {
            insertSysNoticeTemplate(state.form).then(res => {
                messages.success(res.msg)
                state.open = false;
                loadList();
            }).catch(error => {
                // messages.error(error.msg)
                loadList()
                // state.open = false;
            })
        }

    })


}

const handleSelectionChange = (rows?: SysNoticeTemplate[]) => {
    // @ts-ignore
    state.ids = rows?.map(item => item.id)
    state.single = state.ids.length != 1
    state.multiple = !state.ids.length
}

const resetForm = () => {
    Object.assign(state.form,
        {
            templateTitle: undefined,
            templateCode: undefined,
            templateType: undefined,
            nickName: undefined,
            pageNumber: 1,
            pageSize: 10
        })
    loadList();
}


const resetFormRule = (formEl?: FormInstance | undefined) => {
    // 重新赋值
    Object.assign(state.form, {
        id: undefined,
        templateTitle: undefined,
        templateCode: undefined,
        templateType: undefined,
        templateContext: undefined,
        nickName: undefined,
        status: "0",
        sortValue: 0,
        remark: undefined,
    })
    if (!formEl) return
    formEl.resetFields()
}
const toggleQuery = () => {
    state.showQuery = !state.showQuery
}

onMounted(() => {
    loadList()

    console.log(isDark);
    console.log(toggleDark);

})
</script>