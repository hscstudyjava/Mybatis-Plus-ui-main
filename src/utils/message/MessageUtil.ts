import { ElMessage, ElMessageBox, ElNotification, ElLoading, type Action } from 'element-plus';

// https://juejin.cn/post/7061853693121036319
/** 
 * 解决 element-plus 自动导入时的 message 等组件的使用问题
 */
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';
import 'element-plus/theme-chalk/el-notification.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-loading.css'


/** 
 * 
 */
export const message =
{
    info(context: string, showClose?: boolean) {
        ElMessage({
            message: context,
            type: 'info',
            showClose: showClose
        })
    },
    success(context: string, showClose?: boolean) {
        ElMessage({
            message: context,
            type: 'success',
            showClose: showClose

        })
    },
    error(context: string) {
        ElMessage({
            message: context,
            type: 'error',
        })
    },
    warn(context: string) {
        ElMessage(
            {
                message: context,
                type: 'error',
            }
        )
    }
}

/**
 * 消息提示
 */
export const notify = {
    info(title: string, context: string, showClose?: boolean) {
        ElNotification({
            title: title,
            message: context,
            type: 'info',
            showClose: showClose
        })
    },
    success(title: string, context: string, showClose?: boolean) {
        ElNotification({
            title: title,
            message: context,
            type: 'success',
            showClose: showClose
        })
    },
    error(title: string, context: string) {
        ElNotification({
            title: title,
            message: context,
            type: 'error',
        })
    },
    warn(title: string, context: string) {
        ElNotification(
            {
                title: title,
                message: context,
                type: 'error',
            }
        )
    }
}


/**
 * 
 */
export const confirms = {

    confirm(context: string, title?: string, type?: string) {
        ElMessageBox.alert(
            context,
            title || '系统提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: type || "warning",
            }
        )
    },
    prompt(content: string, title?: string, type?: string) {
        ElMessageBox.prompt(content,
            title || "系统提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: type || "warning",
        })

    }
}

/**
 * loading服务
 */
let loadingInstance:any;
export const loading = {
    // 开启
    open(content?:string) {
        loadingInstance = ElLoading.service({
            lock: true,
            text: content|| '努力加载中!!!',
            //      spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
        })
    },
    // 关闭
    close() { 
        loadingInstance.close()
    }
}