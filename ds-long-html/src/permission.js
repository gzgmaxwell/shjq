import router from "./router/router";
import store from "@/store";
import { validatenull } from "@/util/validate";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false });
import { getStore } from "@/util/store";

let isFirst = true;
router.beforeEach((to, from, next) => {
  if (from.fullPath === "/login" && isFirst) {
    store.dispatch("actionDictionary");
    store.dispatch("actionClassify"); // app 标签
    store.dispatch("getLevel");
    store.dispatch("actionAdminTag"); // 后台标签
    store.dispatch("actionDepartment");
    isFirst = false;
  }
  if (
    to.meta.keepAlive === true &&
    store.state.tags.tagList.some((ele) => {
      return ele.value === to.fullPath;
    })
  ) {
    to.meta.$keepAlive = true;
  } else {
    NProgress.start();
    if (to.meta.keepAlive === true && validatenull(to.meta.$keepAlive)) {
      to.meta.$keepAlive = true;
    } else {
      to.meta.$keepAlive = false;
    }
  }
  const meta = to.meta || {};
  if (store.getters.access_token) {
    if (
      store.getters.isLock === true &&
      to.path !== "/lock" &&
      from.path !== "/login"
    ) {
      next({
        path: "/lock",
      });
      NProgress.done();
    } else if (
      !store.getters.isLock &&
      to.path === "/lock" &&
      from.path !== "/login"
    ) {
      next("/wel/index");
    } else if (to.path === "/login") {
      next({ path: "/" });
    } else {
      // NOTE: 当用户角色不存在时，会存在无限请求用户信息接口的问题
      if (store.getters.roles.length === 0) {
        store
          .dispatch("GetUserInfo")
          .then(() => {
            if (
              from.path === "/login" ||
              (from.path === "/" && !getStore({ name: "tagList" }))
            ) {
              next("/wel/index");
              setTimeout("console.clear()", 300);
            } else {
              next();
            }
          })
          .catch(() => {
            store.dispatch("FedLogOut").then(() => {
              next({ path: "/login" });
            });
          });
      } else {
        const value = to.query.src || to.fullPath;
        const label = to.query.name || to.name;

        // 针对外链跳转
        if (value.includes("http") || value.includes("https")) {
          NProgress.done();
          window.open(value, "_blank");
          return;
        }

        if (
          meta.isTab !== false &&
          !validatenull(value) &&
          !validatenull(label)
        ) {
          store.commit("ADD_TAG", {
            label: label,
            value: value,
            params: to.params,
            query: to.query,
            group: router.$avueRouter.group || [],
            path: to.path,
          });
        }
        next();
      }
    }
  } else {
    if (meta.isAuth === false) {
      next();
    } else {
      next("/login");
    }
  }
});

router.afterEach(() => {
  NProgress.done();
  const title = store.getters.tag.label;
  router.$avueRouter.setTitle(title);
});
