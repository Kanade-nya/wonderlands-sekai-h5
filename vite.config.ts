import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 自动导入ICONS
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
// auto加载器
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { UndrawUiResolver } from "undraw-ui/es/resolvers";
// import {resolve} from "node:url";
import path, { resolve } from 'path'
// https://vite.dev/config/
export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                // additionalData: `@use "@/styles/element/index.scss" as *;`,
            },
        },
    },
    build: {
        // sourcemap: true,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,  // 生产环境去除console
                drop_debugger: true  // 生产环境去除debugger
            }
        },
        // 拆分代码块
        // rollupOptions: {
        //     output: {
        //         manualChunks: {
        //             // 将第三方库拆分成独立的chunk
        //             'element-plus': ['element-plus'],
        //             'vue-vendor': ['vue', 'vue-router', 'pinia'],
        //             'editor': ['@wangeditor/editor', '@wangeditor/editor-for-vue']
        //         }
        //     }
        // },
        // commonjsOptions:{
        //     requireReturnsDefault: 'namespace'
        // }
    },
    base: './',
    plugins: [
        vue(),
        // Elements 按需引入的插件
        AutoImport({
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({
                    prefix: 'icon',
                }),
            ],
        }),
        Components({
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({
                    enabledCollections: ['ep'],
                }),
                UndrawUiResolver
            ],
        }),
        Icons({
            autoInstall: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/Unit'),
        },
        extensions: ['.js', '.ts', '.json', '.vue']
    },
    server: {
        host: '0.0.0.0',
        port: 8080,
        open: 'http://192.168.3.194:8080',
        proxy: {
            '/api2': {
                target: 'https://wonderlands-sekai.space/api2',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api2/, ''),
            }
        }
    }
})
