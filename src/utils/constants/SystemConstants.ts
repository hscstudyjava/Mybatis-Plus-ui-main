

export const enum DeviceEnum {

    /**
     * 系统端
     */
    PC = "PC",

    /**
     * 手机
     */
    MOBILE = "mobile",

    /**
     * 其他端
     */
    OTHER = "other"

}

export const enum ElmentSizeEnum {

    /**
     * 默认大小
     */
    DEFAULT = "default",

    /**
     * 大
     */
    LARGE = "large",

    /**
     * 小
     */
    SMALL = "small"

}

export const enum LayoutThemeEnum {

    // 深色主题theme-dark，
    THEME_DARK = "theme-dark",

    // 浅色主题theme-light
    THEME_LIGHT = "theme-light"
}

/**
 * 权限常量
 */
export const enum PermissionEnum{

    /**
     * 超级权限
     */
    SPUPER_PERSSION="*:*:*",

    /**
     * 超级管理员
     */
    SPUER_ROLE="admin",



}

export const enum SystemEnum{

    DEFAULT_SPLIT_SYMBOL=","

    
}

/**
 * 字节、KB、MB、GB
 */
export const enum FileTypeEnum{

    /** 
     * 现在
     */
    BYTE="byte",

    KB="Kb",

    MB="Mb",

    GB="Gb"

}

/** 
 * 系统数据状态
 */
export const enum DataStatusEnum{

    /**
     * 正常
     */
    NORMAL="0",

    /**
     * 禁用
     */
    DISABLE="1"
}