<script setup lang="ts" name="TrainRecordDetails">
import { RecordApi, type TrainRecordResult } from '@/api/train/record';
import { ref } from 'vue';
import { parseTime } from '@/utils/common'
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
const diologOpen = ref(false)
const diologTitle = ref('训练详情')
const loading = ref(false)
const form = ref<TrainRecordResult>({
    policeIdNo: '',
    screenShot: '',
    trainVideo: '',
    hasTrain: false,
    uploadClientVersion: '',
    bizTrainVideo: {
        code: '',
        name: '',
        thumb: '',
        trainType: '',
        trainLevel: '',
        status: '',
        sortValue: 0,
        optionsParams: undefined
    },
    policeInfo: {
        code: '',
        name: '',
        idNo: "",
        category: '',
        position: '',
        remark: '',
        optionsParams: {},
        status: ''
    },
    dept: {
        id: '',
        deptName: ''
    }
})

const open = async (id: number | string) => {
    loading.value = true;
    try {
        const { data } = await RecordApi.getOnce(id)
        form.value = data;
        diologOpen.value = true;
    } catch { }
    finally {
        loading.value = false
    }
}


defineExpose({
    open

})
</script>

<template>
    <el-dialog v-model="diologOpen"   :align-center="true" width="40%">
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <h6 :id="titleId">{{ diologTitle }}</h6>
                <el-divider />
            </div>
        </template>
        <el-descriptions class="margin-top" :column="2" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <svg-icon class="mr-5px" icon="ep:user" />
                        训练人员
                    </div>
                </template>
                {{ form.policeInfo?.name }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <svg-icon class="mr-5px" icon="ion:id-card" />
                        身份号码
                    </div>
                </template>
                {{ form.policeIdNo }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <svg-icon class="mr-5px" icon="dept" />
                        所属部门
                    </div>
                </template>
                {{ form.dept.deptName }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <svg-icon class="mr-5px" icon="ion:videocam" />
                        训练警情
                    </div>
                </template>
                {{ form.bizTrainVideo.name }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <svg-icon class="mr-5px" icon="ion:time" />
                        训练时间
                    </div>
                </template>
                {{ parseTime(form.trainTime!!) }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <svg-icon class="mr-5px" icon="mdi:information-variant-circle" />
                        上传版本
                    </div>
                </template>
                {{ form.uploadClientVersion }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <svg-icon class="mr-5px" icon="mdi:ip-network" />
                        上传IP
                    </div>
                </template>
                {{ form.uploadIp }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <svg-icon class="mr-5px" icon="mdi:alert-decagram" />
                        训练级别
                    </div>
                </template>
                <DictTag :type="DICT_TYPE.BIZ_TRIAN_VIDEO_LEVEL" :value="form.bizTrainVideo.trainLevel" />
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <svg-icon class="mr-5px" icon="mdi:list-box" />
                        训练类型
                    </div>
                </template>
                <DictTag :type="DICT_TYPE.BIZ_TRAIN_VIDEO_TYPE" :value="form.bizTrainVideo.trainType" />
            </el-descriptions-item>


            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <svg-icon class="mr-5px" icon="ep:medal" />
                        训练成绩
                    </div>
                </template>
                <el-tag type="success" v-if="form.hasTrain">合格</el-tag>
                <el-tag type="error" v-else>不合格</el-tag>
            </el-descriptions-item>
        </el-descriptions>

        <template #footer>
            <el-divider />
            <span class="dialog-footer">

            </span>
        </template>

    </el-dialog>
</template>