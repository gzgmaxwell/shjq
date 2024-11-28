import { defineConfig, ConfigEnv, UserConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import UnoCSS from "unocss/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

const pathSrc = path.resolve(__dirname, "src");
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        find: "vue-i18n",
        replacement: "vue-i18n/dist/vue-i18n.cjs.js",
        "./runtimeConfig": "./runtimeConfig.browser",
      },
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `@use "@/styles/variables.scss" as *;`,
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_APP_PORT),
      open: true,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_TARGET_BASE_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp("^" + env.VITE_APP_BASE_API), env.VITE_APP_TARGET_BASE_API), // 替换 /dev-api 为 target 接口地址
        },
      },
    },
    define: {
      ...(process.env.NODE_ENV === "development" ? { global: "window" } : {}),
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      commonjsOptions: {
        include: [/node_modules/],
        extensions: [".js", ".cjs"],
        strictRequires: true,
        transformMixedEsModules: true,
      },
    },
  };
});
const plugins = [
  vue(),
  AutoImport({
    // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
    imports: ["vue"],
    eslintrc: {
      enabled: true, // 是否自动生成 eslint 规则，建议生成之后设置 false
      filepath: "./.eslintrc-auto-import.json", // 指定自动导入函数 eslint 规则的文件
    },
    dts: path.resolve(pathSrc, "types", "auto-imports.d.ts"), // 指定自动导入函数TS类型声明文件路径
    resolvers: [
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      ElementPlusResolver(),
      // 自动导入图标组件
      IconsResolver({}),
    ],
    vueTemplate: true, // 是否在 vue 模板中自动导入
  }),
  Components({
    resolvers: [
      // 自动导入 Element Plus 组件
      ElementPlusResolver(),
      // 自动注册图标组件
      IconsResolver({
        enabledCollections: ["ep"], // element-plus图标库，其他图标库 https://icon-sets.iconify.design/
      }),
    ],
    dts: path.resolve(pathSrc, "types", "components.d.ts"), // 指定自动导入组件TS类型声明文件路径
  }),
  Icons({
    // 自动安装图标库
    autoInstall: true,
  }),
  UnoCSS({
    /* options */
  }),
  createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
    // 指定symbolId格式
    symbolId: "icon-[dir]-[name]",
  }),
  VueI18nPlugin({
    include: [path.resolve(__dirname, "./src/lang/package/**")],
  }),
];
