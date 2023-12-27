import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'



import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
// svg 请阅读--->https://blog.csdn.net/reed_0805/article/details/132962941
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import UnoCSS from 'unocss/vite'
import viteCompression from 'vite-plugin-compression'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        UnoCSS(),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
            symbolId: 'icon-[dir]-[name]',
            svgoOptions: true
        }),
        vueJsx(),
        AutoImport({
            resolvers: [

                ElementPlusResolver(),

                // Auto import icon components
                // 自动导入图标组件
                IconsResolver({
                    prefix: 'Icon',
                }),

            ],

            imports: ['vue', 'vue-router'],

        }),
        Components({
            resolvers: [
                ElementPlusResolver(),

                // 自动注册图标组件
                /*   IconsResolver({
                      enabledCollections: ['ep'],
                  }), */
                IconsResolver(),
            ]
        }),
        Icons({
            autoInstall: true,
        }),
        viteCompression({
            threshold: 10240 // 对大于 1mb 的文件进行压缩
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    // ...其他配置项
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            },
        },
    },
})
