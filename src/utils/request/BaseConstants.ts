export const enum SuccessCode {
    /**
     * 操作成功
     */
    SUCCESS = 20000
}

export const enum ErrorCode {

    /**
     * 异常
     */
    ERROR = 10000,

    /**
     * SYSTEM
     */
    SYSTEM_ERROR = 90000


}

export const enum LoginCode {

    /**
     * accessToken(访问令牌)已经过期
     */
    USER_TOKEN_EXPIRE = 91000,
    /**
     * refresh_token(刷新Token)已经过期
     */
    USER_REFRESH_TOKEN_EXPIRE = 91001,
    /**
     * refresh_token(刷新Token)未携带
     */
    USER_REFRESH_TOKEN_NOT = 91001
}


/**
 * 根据Response.code
 */
export const ResponseCodeErrorMessages = {
    'ERR_NETWORK': '网络连接出错，请检查网络连接！',
    'ERR_ABORTED': '请求被中止',
    'ERR_CONNECTION_REFUSED': '服务器拒绝连接',
    'ERR_TIMED_OUT': '请求超时',
    'ERR_INVALID_URL': '无效的请求URL',
    "ERR_NOT_FOUND": "请求资源未找到",
    "ERR_UNAUTHORIZED": "未授权访问",
    "ERR_FORBIDDEN": "禁止访问",
    "ERR_SERVER_ERROR": "服务器内部错误",
    "ERR_BAD_REQUEST": "错误的请求",
    "ERR_TOO_MANY_REQUESTS": "请求过多",
    "ERR_GATEWAY_TIMEOUT": "网关链接超时",
    default: "未知错误,请您联系管理员"
}

// 请参考-->https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status
export const ResponseStatusErrorMessage = {
    "400": "请求错误",
    "401": "认证失败，无法访问系统资源",
    "403": "您没有当前访问资源权限",
    "404": "资源不存在",
    "500": "服务器内部错误",
    "502": "网关错误",
    "504": "网关超时",
    default: "未知错误,请您联系管理员"
}

