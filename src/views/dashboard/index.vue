<template>
    <div>
        <uploadFiles v-model:list="fileList" :upload-config="upload"/>
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
const { removeDuplicateSlashes, concatTrimStartSlashes, trimStartSlashes, toByte, ignoreFileName } = fileUtil()
const { convertFileList } = userFile()

const upload = ref<UploadFileModelConfig>({
    storeKey: 'local',
    path: 'file',
    limitSize: 1,
    hasSourceName: true,
    hasTimeFilePath: true,
    fileSizeType: FileSizeTypeEnum.GB,
    fileTypeList: ['go', 'js', 'txt','zip','7z', 'xls', 'mkv'],
    limit: 1
})

const fileList = ref<UploadFileResult[]>([
 
])

onMounted(async () => {



})
</script>