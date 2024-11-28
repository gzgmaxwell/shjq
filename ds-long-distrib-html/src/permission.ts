import router from "@/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { usePermissionStoreHook } from "@/store/modules/permission";

const permissionStore = usePermissionStoreHook();

NProgress.configure({ showSpinner: false }); // 进度条

// 白名单路由
const whiteList = ["/login"];

let hasRole = true;
router.beforeEach(async (to, from, next) => {
  const hasToken = localStorage.getItem("accessToken");
  if (hasToken) {
    if (to.path === "/login") {
      // 如果已登录，跳转首页
      console.log(from);
      next({ path: "/" });
      NProgress.done();
    } else {
      if (hasRole) {
        const accessRoutes = await permissionStore.generateRoutes();
        accessRoutes.forEach((route) => {
          router.addRoute(route);
        });
        hasRole = false;
        next({ ...to, replace: true });
      } else {
        next();
      }
    }
  } else {
    // 未登录可以访问白名单页面
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
