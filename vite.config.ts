import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
// 自动导入ICONS
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
// auto加载器
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
import {UndrawUiResolver} from "undraw-ui/es/resolvers";
// import {resolve} from "node:url";
import {resolve} from 'path'
// https://vite.dev/config/
export default defineConfig({
    build: {
        terserOptions: {
            compress: {
                drop_console: true // 移除console
            }
        }
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
        alias: [
            {
                find: '@',
                replacement: resolve(__dirname, './src')
            }
        ]
    },
    server: {
        host: '0.0.0.0',
        port: 8080,
        open: true,
        proxy: {
            '/api2': {
                target: 'https://wonderlands-sekai.space/api2',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api2/, ''),
            }
        }
    }
})
