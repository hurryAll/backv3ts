import { defineConfig,loadEnv } from 'vite'
//loadEnv获取env的实例
import vue from '@vitejs/plugin-vue'
import path from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import {viteMockServe} from 'vite-plugin-mock'
// https://vitejs.dev/config/
export default defineConfig(({command,mode})=>{
  let env=loadEnv(mode,process.cwd());
  return{
    plugins: [vue(),
      //SVG矢量图要使用
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
  //       process.cwd()是指当前node命令执行时所在的文件夹目录比如在D:/aaa/bb目录下执行 yarnQ build那么cwd就是D:/aaa/bb
  // __dirname是指被执行is文件所在的文件夹目录比如D:/aa/scripts
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        localEnabled:command ==='serve'//保证开发阶段可以使用mock
      })
    ],
    //src别名配置
    resolve: {
      alias: {
          "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
      }
  },
  //scss全局变量的配置
  css: {
    //css预处理器
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: '@import "./src/styles/configGlobal.scss";',
      },
    },
  },
  //代理跨域
  server:{
    proxy:{
      [env.VITE_APP_BASE_API]:{
        //获取数据的服务器的地址设置
        target: env.VITE_SERVE,
        //代理跨域
        changeOrigin: true,
        //路径重写
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
  }
})
