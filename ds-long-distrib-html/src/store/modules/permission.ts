import { RouteRecordRaw } from "vue-router";
import { defineStore } from "pinia";
import { constantRoutes, dynamicRouter } from "@/router";
import { store } from "@/store";
import { menuGetUserMenu } from "@/api/auth";

const modules = import.meta.glob("../../views/**/**.vue");
const Layout = () => import("@/layout/index.vue");

/**
 * 递归过滤有权限的异步(动态)路由
 *
 * @param routes 接口返回的异步(动态)路由
 * @param roles 用户角色集合
 * @returns 返回用户有权限的异步(动态)路由
 */
const filterAsyncRoutes = (routes: RouteRecordRaw[]) => {
  const asyncRoutes: RouteRecordRaw[] = [];

  routes.forEach((route) => {
    const tmpRoute = { ...route }; // ES6扩展运算符复制新对象

    // 判断用户(角色)是否有该路由的访问权限
    if (tmpRoute.component?.toString() == "Layout") {
      tmpRoute.component = Layout;
    } else {
      const component = modules[`../../views/${tmpRoute.component}.vue`];
      if (component) {
        tmpRoute.component = component;
      } else {
        tmpRoute.component = modules[`../../views/error-page/404.vue`];
      }
    }

    if (tmpRoute.children) {
      tmpRoute.children = filterAsyncRoutes(tmpRoute.children);
    }

    asyncRoutes.push(tmpRoute);
  });

  return asyncRoutes;
};

// setup
export const usePermissionStore = defineStore(
  "permission",
  () => {
    // state
    const routes = ref<RouteRecordRaw[]>([]);

    // actions
    function setRoutes(newRoutes: any) {
      const concatArr = constantRoutes.concat(newRoutes);
      routes.value = concatArr;
    }
    /**
     * 生成动态路由
     *
     * @param roles 用户角色集合
     * @returns
     */
    function generateRoutes() {
      return new Promise<RouteRecordRaw[]>((resolve, reject) => {
        // 接口获取所有路由

        menuGetUserMenu(-1)
          .then((res) => {
            // 根据角色获取有访问权限的路由
            const { data } = res;
            const list = res.data.data;
            const formatMenue = (arr: any, isChild: any) => {
              // arr.forEach((v: any) => {
              //   const component = isChild ? v.path.substring(1) : "Layout";
              //   v.component = component;
              //   v.meta = {
              //     title: v.name,
              //     langKey: v.path,
              //     icon: "system",
              //     hidden: false,
              //     roles: ["ADMIN"],
              //     keepAlive: true,
              //   };
              //   if (v.children && v.children.length) {
              //     formatMenue(v.children, true);
              //   }
              // });
              // return arr;

              return (
                arr &&
                arr.length &&
                arr.map((v: any) => {
                  const component = isChild ? v.path.substring(1) : "Layout";
                  // const component = isChild ? `() => import("@/views/${v.path.substring(1)}.vue")` : "Layout";
                  const item = {
                    component: component,
                    path: v.path,
                    meta: {
                      title: v.name,
                      langKey: v.path,
                      icon: "system",
                      hidden: false,
                      roles: ["ADMIN"],
                      keepAlive: true,
                    },
                    children: formatMenue(v.children, true),
                  };
                  return item;
                })
              );
            };

            const fun = (arr: any, routerList: any) => {
              arr.forEach((v: any, i: any) => {
                const item: any = routerList.find((m: any) => m.path === v.path);
                if (!item?.path || (item?.children && !item?.children.length)) {
                  arr.splice(i, 1);
                }
                if (
                  Array.isArray(v?.children) &&
                  v?.children.length &&
                  Array.isArray(item?.children) &&
                  item?.children.length
                ) {
                  fun(v.children, item.children);
                }
              });
              return arr;
            };
            const dataElse = formatMenue(fun(list, dynamicRouter), false);
            const asyncRoutes: any = dataElse;
            if (data.code === 200) {
              const accessedRoutes = filterAsyncRoutes(asyncRoutes);
              setRoutes(accessedRoutes);
              resolve(accessedRoutes);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
    return { routes, setRoutes, generateRoutes };
  },
  {
    persist: true,
  }
);

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
