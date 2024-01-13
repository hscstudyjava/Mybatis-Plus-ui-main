
<template>
    <el-upload class="upload-demo" :action="uploadUrl" :accept="fileTypes.join(default_split)" :on-preview="handlePreview"
        :before-upload="handlebeforeUpload" :on-remove="handleRemove" :data="uploadData" :headers="headers"
        :before-remove="beforeRemove" :limit="prop.limit" :on-exceed="handleExceed">
        <el-button type="primary">上传文件</el-button>
        <template #tip v-if="prop.showTip">
            <div class="el-upload__tip">
                请上传<template v-if="fileTypes">
                    文件类型<span style="color: rgb(0, 179, 255);">
                        {{ fileTypes.join('/') }}
                    </span>
                </template>
                <template v-if="prop.fileSize">
                    文件大小不超过:{{ `${prop.fileSize}${prop.fileSizeType}` }}
                </template>
                文件
            </div>
        </template>
    </el-upload>
</template>

<script setup lang="ts">
import { isExternal, isArray } from "@/utils/verify"
import type { PropType } from 'vue'
import { computed, reactive, ref } from 'vue'
import { SystemEnum } from '@/utils/constants/SystemConstants'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { confirms, messages } from "@/utils/message/MessageUtils";
import { getAccessToken } from "@/utils/cache/auth"
import { getUploadFileUrl } from "@/api/files/operation"
const default_split = SystemEnum.DEFAULT_SPLIT_SYMBOL
const prop = defineProps({
    /** 
        * 基础路径
        */
    baseUrl: {
        type: String,
        default: import.meta.env.VITE_APP_BASE_URL,
    },

    /** 
     * 传入的值
     */
    value: [String, Object, Array],

    fileType: {
        type: [String, Array] as PropType<string | string[]>,
        default: ['xls', 'pdf', 'txt']
    },

    headers: {
        type: Object,
        default: {
            Authorization: getAccessToken()
        }
    },

    /** 
     * 默认设置KB
     */
    fileSize: {
        type: Number,
        default: 5
    },
    /*** 
     * 文件大小类型默认KB
     */
    fileSizeType: {
        type: String,
        default: "Mb"
    },

    /** 
     * 文件上传数量
     */
    limit: {
        type: Number,
        default: 3
    },

    showTip: {
        type: Boolean,
        default: true
    }
})

const state = reactive({

})

const uploadData = reactive({
    fileTypeList: "",
    hasSource: false,
    hasTimeFile: false
})


const fileTypes = computed(() => {
    // 解构
    let fileType = prop.fileType
    if (typeof fileType == 'string') {
        if (!fileType.includes(default_split)) return fileType
        return fileType.split(default_split).map(item => '.' + item)
    }
    return fileType.map(item => '.' + item)
})

const convertFileType = (): string => {
    // 解构
    let fileType = prop.fileType
    if (typeof fileType == 'string') {
        if (!fileType.includes(default_split)) return fileType
        return fileType.split(default_split).join(default_split)
    }
    return fileType.map(item => '.' + item).join(default_split)
}


const uploadUrl = ref()

/** 
 * 删除
 */
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {

}

/** 
 * 上传前操作
 */
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
    console.log("1");
}
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
    //   return 
    return confirms.confirm('ok').then(res => {
        return true
    }).catch(error => false)
}
const handlebeforeUpload: UploadProps['beforeUpload'] = async (rowFile) => {
    // console.log(rowFile);
    uploadData.fileTypeList = convertFileType()
    // 判断玩获得上传路径
    const { data } = await getUploadFileUrl({
        storeKey: "local",
        path: "path",
        hasSource: true,
        hasTimeFile: true,
        fileTypeList: prop.fileType,
        md5: ""
    })
    uploadUrl.value = data;
}
/** 
 * 当超出限制时，执行的钩子函数
 */
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    messages.warn(`上传文件不允许超过${prop.limit}个`)
}



</script>

<style scope lang="scss"></style>
