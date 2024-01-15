<template>
    <div>
        <!-- <uploadFiles v-model:list="fileList" :upload-config="upload"/> -->
        <Test v-model:list="str"></Test>
        <button @click="onAdd">ok?</button>
    </div>
</template>
    
<script setup lang="ts">
import { getFileStorageSupport } from '@/api/files/storage';
import { DynamicFrom } from '@/components/DynamicFrom';
import type { DynamicFromFild } from '@/types';
import { onMounted, reactive, ref, shallowRef, unref } from 'vue';
import { userFile } from '@/hooks/web/file'
import { fileUtil } from '@/utils/common';
import { FileSizeTypeEnum } from '@/utils/constants/SystemConstants';
import type { UploadFileModelConfig, UploadFileResult, UploadModel } from '@/api/files/type';
import Test from './test.vue';
const { removeDuplicateSlashes, concatTrimStartSlashes, trimStartSlashes, toByte, ignoreFileName } = fileUtil()
const { convertFileList } = userFile()
import { pageTrainRecord } from '@/api/train/record'

const upload = ref<UploadFileModelConfig>({
    storeKey: 'local',
    path: 'file',
    limitSize: 1,
    hasSourceName: true,
    hasTimeFilePath: true,
    fileSizeType: FileSizeTypeEnum.GB,
    fileTypeList: ['go', 'js', 'txt', 'zip', '7z', 'xls', 'mkv'],
    limit: 1
})

const list = ref<string[]>([])
const str = ref<string>("111")
const onAdd = () => {
    list.value?.push("ok")
}



onMounted(async () => {



})
</script>