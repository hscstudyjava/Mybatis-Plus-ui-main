<script setup lang="ts" name="TrainVideoChildFrom">
import { reactive, ref, unref, type PropType } from 'vue';
import { getTrainVideoChildren, TrainVideoApi, basePeri, TrainVideoChildApi } from '@/api/train/video';
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import type { TrainVideoChild } from '@/api/train/type';
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import { number } from 'vue-types';
import type { UploadFileModelConfig, UploadFileResult } from '@/api/files/type';
import { FileSizeTypeEnum } from '@/utils/constants/SystemConstants';
import { MimeFileType } from '@/utils/common';
import { useAppStore } from '@/stores/app';

const { getFileConfig } = useAppStore()

const train_Id = ref()

const diologOpen = ref(false)
const list = ref<TrainVideoChild[]>()
const loading = ref(false)
const query = ref({
    trainId: 0,
    name: '',
    realType: '',
    switchType: ''
})
const queryRef = ref()
// 上传配置
const uploadConfig = ref<UploadFileModelConfig>({
    fileSizeType: FileSizeTypeEnum.GB,
    fileTypeList: MimeFileType.VIDEO_EXTENSION,
    limit: 1,
    storeKey: getFileConfig.fileInitKey,
    path: 'train/video',
    limitSize: 1,
    hasSourceName: false,
    hasTimeFilePath: true
})

const uploadList = ref<UploadFileResult[]>([])

const open = async (trainId: number) => {
    diologOpen.value = true;
    query.value.trainId = trainId
    train_Id.value = trainId
    await loadList();// 加载数据
}

const loadList = async () => {
    loading.value = true
    try {
        const { data } = await getTrainVideoChildren(unref(query))
        list.value = data
    } finally {
        loading.value = false
    }
}
const resetQuery = async () => {
    query.value = {
        trainId: unref(train_Id),
        name: '',
        realType: '',
        switchType: ''
    }
    queryRef.value?.resetFields()
    await loadList();// 加载数据

}

const formOpen = ref(false)
const formTitle = ref('')
const formRef = ref()
const formLoading = ref(false)
const form = reactive<TrainVideoChild>({
    trainId: '',
    name: '',
    realType: '',
    switchType: '',
    id: null,
    parentId: null,
    label: '',
    children: [],
    path: []
})


const resetForm = async () => {
    Object.assign(form, {
        trainId: unref(train_Id),
        name: '',
        realType: '',
        switchType: '',
        path: [],
        id: undefined,
        parentId: "0",
        label: '',
        children: []
    })
    queryRef.value?.resetFields()
}


const videoTreeList = ref<TrainVideoChild[]>([])

// 
const handleVideoTree = () => {
    videoTreeList.value = [];// 清空数据
    const parentObj: TrainVideoChild = {
        id: '0',
        parentId: '',
        name: '主类目',
        children: [] as Array<TrainVideoChild>,
        trainId: '',
        realType: '',
        switchType: '',
        path: [],
        label: ''
    }
    // @ts-ignore
    parentObj.children = unref(list)
    // @ts-ignore
    videoTreeList.value.push(parentObj)
}


/** 
 * 新增
 */
const handleOpenForm = async (row?: TrainVideoChild, type?: boolean) => {
    formOpen.value = true
    formTitle.value = "新增视频"
    formLoading.value = true;
    // 处理一下关联数据即可
    try {
        resetForm();//重置表单
        handleVideoTree();
        // 
        if (row) {
            if (type) {
                formTitle.value = "更新视频"
                const { data } = await TrainVideoChildApi.getOnce(row.id!!)
                Object.assign(form, data)
                return;
            } else {
                form.parentId = row.id
            }
        }
    } finally {
        formLoading.value = false
    }

}

const submit = async () => {
    formLoading.value = true
    // 校验表单
    if (!formRef) {
        return;
    }
    const valid = await formRef.value.validate()
    if (!valid) {
        notify.warn('系统提示', '表单填写不正确!!!')
        return
    }
    try {
        if (form.id) {
            const { msg } = await TrainVideoChildApi.update(form)
            messages.success(msg)
        } else {
            const { msg } = await TrainVideoChildApi.insert(form)
            messages.success(msg)
        }
        formOpen.value = false
        await loadList();
    } catch (error: any) {
        if (error.msg) messages.error(error.msg)
    }
    finally {
        formLoading.value = false
    }

}
/**
 * 删除
 */
const handleRemove = async (row: TrainVideoChild) => {
    try {
        await confirms.confirm(`您确定是否删除当前数据?`)//确认通过执行下方逻辑
        // 开始删除
        const { msg } = await TrainVideoChildApi.remove(row?.id!!)
        messages.success(msg);//提醒用户
        await loadList()// 重新加载
    } catch (error: any) {
        if (error.msg) {
            messages.error(error.msg);//提醒用户
        }
    }

}



const emit = defineEmits(['success'])
defineExpose({
    open
})

</script>

<template>
    <!-- 表格展示 -->
    <el-dialog v-model="diologOpen" :close-on-click-modal="false" :draggable="true" :align-center="true" width="80%">
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <h6 :id="titleId">警情数据</h6>
                <el-divider />
            </div>
        </template>
        <!-- 表单 -->
        <el-form :inline="true" :model="query" ref="queryFromRef" class="demo-form-inline" @submit.native.prevent>

            <el-form-item label="视频名称" prop="name">
                <el-input v-model="query.name" placeholder="请输入视频名称" @keyup.enter.native="loadList" clearable />
            </el-form-item>

            <el-form-item label="警情类型" prop="switchType">
                <el-select v-model="query.switchType" placeholder="请选择警情类型" class="w-full">
                    <el-option v-for="item in getDictOptions(DICT_TYPE.BIZ_TRAIN_SWITCH_TYPE)" :key="item.value"
                        :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="实名/匿名" prop="realType">
                <el-select v-model="query.realType" placeholder="请选择实名/匿名" class="w-full">
                    <el-option v-for="item in getDictOptions(DICT_TYPE.SYSTEM_TRAIN_REAL_TYPE)" :key="item.value"
                        :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="loadList">
                    <template #icon>
                        <svg-icon icon="ep:search" />
                    </template>
                    查询</el-button>
                <el-button @click="resetQuery">
                    <template #icon>
                        <svg-icon icon="ep:refresh" />
                    </template>
                    重置</el-button>
                <el-button type="success" @click="handleOpenForm">
                    <template #icon>
                        <svg-icon icon="ep:plus" />
                    </template>
                    新增</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="treeTableRef" v-loading="loading" stripe border :data="list" style="width: 100%" row-key="id" lazy
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column prop="name" show-overflow-tooltip label="警情名称" />
            <el-table-column show-overflow-tooltip align="center" label="警情路径">
                <template #default="scope">
                    <span v-if="scope.row.path && scope.row.path.length > 0">
                        {{ scope.row.path[0].name }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip align="center" label="警情类型">
                <template #default="socpe">
                    <DictTag :type="DICT_TYPE.BIZ_TRAIN_SWITCH_TYPE" :value="socpe.row.switchType"></DictTag>
                </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip align="center" label="实名/匿名">
                <template #default="socpe">
                    <DictTag :type="DICT_TYPE.SYSTEM_TRAIN_REAL_TYPE" :value="socpe.row.realType"></DictTag>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="200px">
                <template #default="socpe">
                    <el-button link v-peri="[`${basePeri}save`]" type="success" @click="handleOpenForm(socpe.row)">
                        <template #icon>
                            <el-icon>
                                <i-ep-plus />
                            </el-icon>
                        </template>
                        新增
                    </el-button>

                    <el-button link v-peri="[`${basePeri}update`]" @click="handleOpenForm(socpe.row, true)" type="primary">
                        <template #icon>
                            <el-icon>
                                <i-ep-Edit />
                            </el-icon>
                        </template>
                        更新
                    </el-button>
                    <el-button link v-peri="[`${basePeri}remove`]" @click="handleRemove(socpe.row)" type="danger">
                        <template #icon>
                            <el-icon>
                                <i-ep-delete />
                            </el-icon>
                        </template>
                        更新
                    </el-button>

                </template>
            </el-table-column>
        </el-table>

    </el-dialog>
    <!-- 表单提交 -->
    <el-dialog v-model="formOpen" :close-on-click-modal="false" :draggable="true" :align-center="true" width="30%">
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <h6 :id="titleId">警情数据</h6>
                <el-divider />
            </div>
        </template>
        <!-- 表单 -->
        <el-form :model="form" ref="formRef" v-loading="formLoading">

            <el-form-item label="上级类目">
                <el-tree-select style="width:100%" v-model="form.parentId" node-key="id" :props="{ label: 'name' }"
                    :data="videoTreeList" check-strictly :render-after-expand="false" />
            </el-form-item>

            <el-form-item label="视频名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入视频名称" @keyup.enter.native="loadList" clearable />
            </el-form-item>

            <el-form-item label="警情类型" prop="switchType">
                <el-select v-model="form.switchType" placeholder="请选择警情类型" class="w-full">
                    <el-option v-for="item in getDictOptions(DICT_TYPE.BIZ_TRAIN_SWITCH_TYPE)" :key="item.value"
                        :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="实名/匿名" prop="realType">
                <el-select v-model="form.realType" placeholder="请选择实名/匿名" class="w-full">
                    <el-option v-for="item in getDictOptions(DICT_TYPE.SYSTEM_TRAIN_REAL_TYPE)" :key="item.value"
                        :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="上传视频" prop="path">
                <uploadFiles :upload-config="uploadConfig" v-model:list="form.path" />
            </el-form-item>



        </el-form>
        <template #footer>
            <el-divider />
            <span class="dialog-footer">

                <el-button @click="resetForm">重置</el-button>

                <el-button type="primary" @click="submit">提交</el-button>

            </span>
        </template>
    </el-dialog>
</template>