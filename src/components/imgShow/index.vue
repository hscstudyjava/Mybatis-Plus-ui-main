<template>
    <div class="img-container" :style="`width:${realWidth};height:${realHeight};`">
        <!-- multple -->
        <el-image v-if="realUrl.length && realUrl.length == prop.max" v-for="(url, index) in realUrl"
            style="width: 100%; height: 100%" :key="index" :lazy="prop.lazy" oom-rate="1.2" :max-scale="7" :min-scale="0.2"
            :preview-src-list="urlList" :initial-index="0" fit="cover" :src="url">
            <template #error>
                <div class="image-error">
                    <el-icon>
                        <i-ep-picture />
                    </el-icon>
                </div>
            </template>
        </el-image>
        <!--signle  -->
        <el-image v-else style="width: 100%; height: 100%" :src="realUrl" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
            :preview-src-list="urlList" :initial-index="0" :lazy="prop.lazy" fit="cover">
            <template #error>
                <div class="image-error">
                    <el-icon>
                        <i-ep-picture />
                    </el-icon>
                </div>
            </template>
        </el-image>
    </div>
</template>

<script lang="ts" setup>
import defaultPng from "@/assets/img/default/index.png"
import defaultPng1 from "@/assets/img/default/index1.png"
import { isExternal, isArray } from "@/utils/verify"
import { computed, type PropType } from 'vue'
import { SystemEnum } from '@/utils/constants/SystemConstants'
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
     * 判断是本服务器还是HTTP版本
     * 
     * url,url,url
     */
    url: {
        type: [String, Array] as PropType<string | string[]>,
        // setting a img
        default: defaultPng1
    },

    /** 
     *  默认展示几个
     */
    max: {
        type: Number,
        default: 2
    },

    width: {
        type: String || Number,
        default: 100
    },

    height: {
        type: String,
        default: 100
    },

    /** 
     * 默认懒加载
     */
    lazy: {
        type: Boolean,
        default: true
    }


})


// 真实文件路径
/** 
 * 1. 判断真实路径
 * 2. 判断结束后
 */
const realUrl = computed(() => {
    // 首先需要判断single || multiple   
    if (typeof prop.url == 'string') {
        // 判断includes(,)
        if (prop.url.includes(default_split)) {
            // 默认分割
            let urls = prop.url.split(default_split)
            return urls.map(currentUrl => {
                // 判断Http
                /*   if(isExternal(currentUrl)) return currentUrl;
                  return prop.baseUrl+currentUrl; */
                return currentUrl
            })
        }
        // http直接返回url
        /*  if (isExternal(prop.url)) return prop.url;
         return prop.baseUrl + prop.url */
        return prop.url
    } else {
        // current multple is array
        return prop.url.map(currentUrl => {
            // 判断Http
            /*   if(isExternal(currentUrl)) return currentUrl;
              return prop.baseUrl+currentUrl; */
            return currentUrl
        })
    }
})

const realWidth = computed(() => {
    return typeof prop.width == "string" ? prop.width : `${prop.width}px`;
})

const realHeight = computed(() => {
    return typeof prop.height == "string" ? prop.height : `${prop.height}px`
})

/*** 
 * http:xxx => true
 * /file/a.png=>fasle base+url
 */
const isExternalUrl = (url: String): String => {
    if (isExternal(url as string)) return url;
    return prop.baseUrl as string + url
}

/** 
 * 如果是个列表需要渲染
 */
const urlList = computed(() => {
    const srcList: any[] = []
    // @ts-ignore
    if (isArray(realUrl.value)) {
        // @ts-ignore

        realUrl.value.map(currentUrl => {
            srcList.push(currentUrl)
        })
        return srcList
    } else {
        srcList.push(realUrl.value)
        return srcList
    }
})
</script>

<style scope lang="scss">
// 顶级容器
.img-container {


    /* 控制溢出部分隐藏 */
    // 多个
    .image-multple {}

    .image-single {}

    // 图片不展示
    .image-error {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: var(--el-fill-color-light);
        color: var(--el-text-color-secondary);
        font-size: 30px;

        .el-icon {
            font-size: 30px;
        }
    }
}
</style>

