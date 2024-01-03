<script setup lang="ts" name="videoFrom">
import { reactive, ref } from 'vue';
import type { TrainVideo } from '@/api/train/type';
import { TrainVideoApi } from '@/api/train/video';
import { messages, notify } from '@/utils/message/MessageUtils';
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'

const diologOpen = ref(false)
const diologTitle = ref('')
const loading = ref(false)
const fromRef = ref()
const form = reactive<TrainVideo>({
    code: '',
    name: '',
    thumb: '',
    trainType: '',
    trainLevel: '',
    status: '',
    sortValue: 0,
    optionsParams: {
        gunLocalUrl: '',
        fpsStartTime: '',
        fpsEndTime: '',
        videoTime: 0,
        playTime: 0,
        closeCamera: 0,
        openPoliceCard: 0
    }
})

const rules = reactive({
    name: [
        { message: '警情名称必须填写', trigger: 'blur', required: true }
    ],

    code: [
        { message: '警情编码必须填写', trigger: 'blur', required: true }
    ],

    trainType: [
        { message: '警情类型必须选择', trigger: 'change', required: true }
    ],

    trainLevel: [
        { message: '警情等级必须选择', trigger: 'blur', required: true }
    ],

})

const open = async (type: string, id: number) => {
    diologOpen.value = true
    diologTitle.value = '新增警情'
    resetFrom();
    if (type === 'update') {
        loading.value = true;
        const { data } = await TrainVideoApi.getOnce(id)
        Object.assign(form, data)
        diologTitle.value = '更新警情'
        loading.value = false
    }
}

const submit = async () => {
    // 校验表单
    if (!fromRef) {
        return;
    }
    const valid = await fromRef.value.validate()
    if (!valid) {
        notify.warn('系统提示', '表单填写不正确!!!')
        return
    }

    try {
        if (form.id) {
            const { msg } = await TrainVideoApi.update(form)
            messages.success(msg)
        } else {
            const { msg } = await TrainVideoApi.insert(form)
            messages.success(msg)
        }
        diologOpen.value = false
        emit('success')
    } catch (error: any) {
        if (error.msg) messages.error(error.msg)
    }
    finally {
        loading.value = false
    }
}

const emit = defineEmits(['success'])

defineExpose({
    open
})

const resetFrom = () => {
    Object.assign(
        form,
        {
            code: '',
            name: '',
            thumb: '',
            trainType: '',
            trainLevel: '',
            status: '',
            sortValue: 0,
            optionsParams: {
                gunLocalUrl: '',
                fpsStartTime: '',
                fpsEndTime: '',
                videoTime: 0,
                playTime: 0,
                closeCamera: 0,
                openPoliceCard: 0
            }
        }
    )
    fromRef.value?.resetFields()
}

</script>

<template>
    <el-dialog v-model="diologOpen" :close-on-click-modal="false" :draggable="true" :align-center="true" width="30%">
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <h6 :id="titleId">{{ diologTitle }}</h6>
                <el-divider />
            </div>
        </template>

        <el-form ref="fromRef" :model="form" :rules="rules" status-icon label-width="80px">

            <el-row>
                <el-col :span=12 :xs="24">
                    <el-form-item label="警情名称" prop="name">
                        <el-input v-model="form.name" placeholder="请填写警情名称" clearable />
                    </el-form-item>

                </el-col>

                <el-col :span=12 :xs="24">
                    <el-form-item label="警情编码" prop="code">
                        <el-input v-model="form.code" placeholder="请填写警情编码" clearable />
                    </el-form-item>
                </el-col>

                <el-col :span=12 :xs="24">
                    <el-form-item label="警情类型" prop="trainType">
                        <el-select v-model="form.trainType" placeholder="请选择数据权限" class="w-full">
                            <el-option v-for="item in getDictOptions(DICT_TYPE.BIZ_TRAIN_VIDEO_TYPE)" :key="item.value"
                                :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span=12 :xs="24">
                    <el-form-item label="警情等级" prop="trainLevel">
                        <el-select v-model="form.trainLevel" placeholder="请选择数据权限" class="w-full">
                            <el-option v-for="item in getDictOptions(DICT_TYPE.BIZ_TRIAN_VIDEO_LEVEL)" :key="item.value"
                                :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>


                <el-col :span=12 :xs="24">
                    <el-form-item label="排序" prop="status">
                        <el-input-number v-model="form.sortValue" :min="0" :max="100" controls-position="right"
                            class="w-full" />
                    </el-form-item>
                </el-col>

                <el-col :span=12 :xs="24">
                    <el-form-item label="状态" prop="status">
                        <el-switch v-model="form.status" active-value="0" inactive-value="1" inline-prompt active-text="正常"
                            inactive-text="禁用" />
                    </el-form-item>
                </el-col>

                <el-col :span=12 :xs="24">
                    <el-form-item label="开始帧率" prop="optionsParams.fpsStartTime">
                        <el-input v-model="form.optionsParams.fpsStartTime" placeholder="请填写开始帧率" clearable />
                    </el-form-item>
                </el-col>

                <el-col :span=12 :xs="24">
                    <el-form-item label="结束帧率" prop="optionsParams.fpsEndTime">
                        <el-input v-model="form.optionsParams.fpsEndTime" placeholder="请填写结束帧率" clearable />
                    </el-form-item>
                </el-col>

                <el-col :span=12 :xs="24">
                    <el-form-item label="动作开始" prop="optionsParams.playTime">
                        <el-input v-model.number="form.optionsParams.playTime" placeholder="请填写动作开始" clearable />
                    </el-form-item>
                </el-col>

                <el-col :span=12 :xs="24">
                    <el-form-item label="语音结束" prop="optionsParams.videoTime">
                        <el-input v-model.number="form.optionsParams.videoTime" placeholder="请填写语音结束" clearable />
                    </el-form-item>
                </el-col>

                <el-col :span=12 :xs="24">
                    <el-form-item label="警官证" prop="optionsParams.openPoliceCard">
                        <el-input v-model.number="form.optionsParams.openPoliceCard" placeholder="请填写警官证" clearable />
                    </el-form-item>
                </el-col>

                <el-col :span=12 :xs="24">
                    <el-form-item label="执法记录仪" prop="optionsParams.closeCamera">
                        <el-input v-model.number="form.optionsParams.closeCamera "  placeholder="请填写执法记录仪" clearable />
                    </el-form-item>
                </el-col>

            </el-row>

            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                    clearable></el-input>
            </el-form-item>

        </el-form>

        <template #footer>
            <el-divider />
            <span class="dialog-footer">

                <el-button @click="resetFrom">
                    重置
                </el-button>

                <el-button type="primary" @click="submit">
                    提交
                </el-button>

            </span>
        </template>

    </el-dialog>
</template>