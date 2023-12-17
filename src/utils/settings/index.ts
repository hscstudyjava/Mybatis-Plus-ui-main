import { LayoutThemeEnum } from "../constants/SystemConstants"

export interface SettingInterface {
    title: string,
    /**
     * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
     */
    sideTheme: string,

    /**
     * 侧边栏颜色
     */
    themeColor: string,
    /**
     * 是否系统布局配置
     */
    showSettings: boolean,

    /**
     * 是否显示顶部导航
     */
    topNav: boolean,

    /**
     * 是否显示 tagsView
     */
    tagsView: boolean,

    /**
     * 是否固定头部
     */
    fixedHeader: boolean,

    /**
     * 是否显示logo
     */
    sidebarLogo: boolean,

    /**
     * 是否显示动态标题
     */
    dynamicTitle: boolean,

    /**
     * 是否显示水印
     */
    watermark: boolean,

    /**
     * 水印内容
     */
    watermarkContext: string,

    /**
     * @type {string | array} 'production' | ['production', 'development']
     * @description Need show err logs component.
     * The default is only used in the production env
     * If you want to also use it in dev, you can pass ['production', 'development']
     */
    errorLog: string
}

/**
 * 默认配置e
 */
export const DefaultSetting: SettingInterface = {
    /** 
  * 系统标题
  */
    title: "芒星智慧管理平台",
    /**
 * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
 */
    sideTheme: LayoutThemeEnum.THEME_DARK,

    /**
     *
     */
    themeColor: '#409EFF',
    /**
     * 是否系统布局配置
     */
    showSettings: false,

    /**
     * 是否显示顶部导航
     */
    topNav: false,

    /**
     * 是否显示 tagsView
     */
    tagsView: true,

    /**
     * 是否固定头部
     */
    fixedHeader: false,

    /**
     * 是否显示logo
     */
    sidebarLogo: true,

    /**
     * 是否显示动态标题
     */
    dynamicTitle: true,

    /**
     * @type {string | array} 'production' | ['production', 'development']
     * @description Need show err logs component.
     * The default is only used in the production env
     * If you want to also use it in dev, you can pass ['production', 'development']
     */
    errorLog: 'production',

    /**
     * 是否显示水印
     */
    watermark: true,

    /**
     * 水印内容
     */
    watermarkContext: "hsc",

}

