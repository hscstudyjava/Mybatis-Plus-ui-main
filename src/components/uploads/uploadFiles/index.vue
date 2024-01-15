
<template>
    <el-upload class="upload-demo" :action="uploadUrl" :accept="fileTypeList.join(default_split)"
        :on-preview="handlePreview" :on-success="handleUploadSuccess" :on-error="handleUploadError" :show-file-list="false"
        :file-list="list" :before-upload="handlebeforeUpload" :headers="headers" :before-remove="beforeRemove"
        :limit="uploadConfig.limit" :on-exceed="handleExceed" ref="uploadRef">
        <el-button type="primary">上传文件</el-button>
        <template #tip v-if="prop.showTip">
            <div class="el-upload__tip">
                请上传<template v-if="fileTypeList">
                    文件类型<span style="color: rgb(0, 179, 255);">
                        {{ fileTypeList.join('/') }}
                    </span>
                </template>
                <template v-if="uploadConfig.limitSize">
                    文件大小不超过:{{ byteUpShift(toByte(uploadConfig.limitSize, uploadConfig.fileSizeType)) }}
                </template>
                文件
            </div>
        </template>
    </el-upload>
    <!-- 文件列表 -->
    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
        <li :key="index" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in list">
            <el-link :href="`${convertFileList(file.url)}`" :underline="false" target="_blank">
                <svg-icon icon="ep:document" />
                {{ file.name }}
            </el-link>
            <div class="ele-upload-list__item-content-action">
                <!-- 下载 -->
                <el-link :href="`${convertFileList(file.url)}`" :underline="false" type="primary" target="_blank">
                    <svg-icon icon="ep:download" />
                </el-link>
                <!-- 删除 -->
                <el-link :underline="false" @click="handleListRemove(index)" type="danger">
                    <svg-icon icon='ep:delete'></svg-icon>
                </el-link>
            </div>
        </li>
    </transition-group>
</template>

<script setup lang="ts">
import { isExternal, isArray } from "@/utils/verify"
import type { PropType } from 'vue'
import { computed, reactive, ref, shallowRef, unref } from 'vue'
import { FileSizeTypeEnum, SystemEnum } from '@/utils/constants/SystemConstants'
import type { UploadFile, UploadFiles, UploadProps, UploadUserFile } from 'element-plus'
import { confirms, loading, messages } from "@/utils/message/MessageUtils";
import { getAccessToken } from "@/utils/cache/auth"
import { getUploadFileUrl } from "@/api/files/operation"
import { fileUtil } from "@/utils/common"
import type { UploadFileModelConfig, UploadFileResult, UploadModel } from "@/api/files/type"
import { userFile } from "@/hooks/web/file"
import { instanceOf, object } from "vue-types"
const { convertFileList } = userFile()
const { toByte, ignoreFileName, byteUpShift, checkContains } = fileUtil()
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
    list: [Array] as PropType<UploadFileResult[]>,

    headers: {
        type: Object,
        default: {
            Authorization: getAccessToken()
        }
    },

    showTip: {
        type: Boolean,
        default: true
    },

    uploadConfig: {
        type: Object as PropType<UploadFileModelConfig>,
        default(rawProps: UploadFileModelConfig) {
            return {
                storeKey: "",
                path: "",
                limitSize: 0,
                hasSourceName: false,
                hasTimeFilePath: false,
                fileTypeList: [],
                fileSizeType: '',
                limit: 3
            }
        }
    }
})
const uploadRef = shallowRef();
// 文件允许上传Url
const uploadUrl = ref();
// 判断是否上传成功
const uploadNumber = ref(0);
// 上传文件数据
const uploadData = reactive<UploadModel>({
    storeKey: "",
    path: "",
    name: "",
    size: 0,
    limitSize: 0,
    hasSourceName: false,
    hasTimeFilePath: false
})
const fileTypeList = computed((): string[] => {
    const strs = prop.uploadConfig.fileTypeList;
    if (typeof strs === 'string') {
        // 是否包含判断符,
        if (!strs.includes(default_split)) {
            if (checkContains(strs, ".")) {
                return [strs]
            } else {
                return ["." + strs];
            }
        }
        // 分割结束后判断是否包含.
        return strs.split(default_split)
            .map(item => {
                // 是否包含.
                if (checkContains(item, ".")) {
                    return item
                } else {
                    return "." + item;
                }
            }).flat()
    }
    return strs.map(item => {
        // 是否包含.
        if (checkContains(item, ".")) {
            return item
        } else {
            return "." + item;
        }
    }).flat();
})
// 文件集合
const fileLists = computed(() => {
    const propList = prop.list
    if (propList) {
        return Array.isArray(propList) ? propList : [propList]
    }
    return []
})


/** 
 * 上传前操作
 */
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
    console.log("1");
}
const beforeRemove: UploadProps['beforeRemove'] = async (uploadFile, uploadFiles) => {
    //   return 
    try {
        return true;
    } catch (error) {
        return false
    }
}
const handlebeforeUpload: UploadProps['beforeUpload'] = async (rowFile) => {
    // 实例化
    Object.assign(uploadData, prop.uploadConfig)
    // 需要判断的参数
    const fileName = rowFile.name;
    const fileSize = rowFile.size;
    const limitSize = toByte(uploadData.limitSize, prop.uploadConfig.fileSizeType)
    // 判断文件后缀是否符合标准
    if (!ignoreFileName(fileName, fileTypeList.value)) {
        messages.error(`文件格式不正确, 请上传${unref(fileTypeList).join("/")}格式文件!`)
        return false;
    }
    // 判断文件大小是否符合上传
    if (limitSize && fileSize >= limitSize) {
        messages.error(`当前文件大小${byteUpShift(fileSize)}已经超出限定文件大小${byteUpShift(limitSize)}`)
        return false;
    }
    // 判断是否符合入参名称
    uploadData.name = fileName;
    uploadData.size = fileSize
    uploadData.limitSize = limitSize;
    uploadData.fileTypeList = unref(fileTypeList)
    // 判断玩获得上传路径
    const { data } = await getUploadFileUrl(uploadData)
    // 赋值上传配置
    uploadUrl.value = data.uploadFileUrl;
    data.uploadFileUrl = '';// 不保存这个值
    loading.open("开始上传文件...")
    uploadNumber.value++;
    // 数据保存到value中
    prop.list?.push(data)
}

// 上传成功处理操作
const handleUploadSuccess: UploadProps['onSuccess'] = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    if (response.code === 20000) {
        uploadedSuccessfully();
    } else {
        // 提示用户
        messages.error(response.msg);
        // 去除最后一个数据
        // fileLists.value!!.pop();
        prop.list?.pop();
        uploadedSuccessfully();
    }
}

const uploadedSuccessfully = () => {
    loading.close();
}
/** 
 * 当超出限制时，执行的钩子函数
 */
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    const limit = prop.uploadConfig.limit
    const currentLenght = fileLists.value!!.length
    if (currentLenght && currentLenght >= limit) {
        messages.error(`上传文件不允许超过${prop.uploadConfig.limit}个`)
    }
}

const handleUploadError: UploadProps['onError'] = (error: any) => {
    messages.error('上传失败')
    loading.close();
}

/** 
 * 删除list中数据
 */
const handleListRemove = async (index: number) => {
    // 确定后执行删除
    const currentItme = fileLists.value!![index]
    try {
        await confirms.confirm(`您确定删除当前文件:(${currentItme?.name})吗?`)
        // fileLists.value!!.splice(index, 1);
        prop.list?.splice(index, 1);
        uploadRef.value.clearFiles();
        // 后续可以根据这个查找到PathName然后去调用后端删除数据,目前暂时不开发了   
    } catch (error) { }
}



</script>

<style scope lang="scss">
.upload-file-uploader {
    margin-bottom: 5px;
}

.upload-file-list .el-upload-list__item {
    border: 1px solid #e4e7ed;
    line-height: 2;
    margin-bottom: 10px;
    position: relative;
}

.upload-file-list .ele-upload-list__item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: inherit;
}

.ele-upload-list__item-content-action .el-link {
    margin-right: 10px;
}
</style>
