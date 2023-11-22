export const enum SuccessCode{
    /**
     * 操作成功
     */
    SUCCESS=20000
}

export const enum ErrorCode{

    /**
     * 异常
     */
    ERROR=10000,

    /**
     * SYSTEM
     */
    SYSTEM_ERROR=90000


}

export const enum LoginCode{

    /**
     * accessToken(访问令牌)已经过期
     */
    USER_TOKEN_EXPIRE=91000,
    /**
     * refresh_token(刷新Token)已经过期
     */
    USER_REFRESH_TOKEN_EXPIRE=91001,
    /**
     * refresh_token(刷新Token)未携带
     */
    USER_REFRESH_TOKEN_NOT=91001
}


