import { getStore, setStore, removeStore, clearStore } from "@/util/store";
import { isURL, validatenull } from "@/util/validate";
import {
  getUserInfo,
  loginByUsername,
  logout,
  refreshToken,
} from "@/api/login";
import { deepClone, encryption } from "@/util/util";
import webiste from "@/const/website";
import { getMenu } from "@/api/admin/menu";
import store from "@/store";
import routeList from "@/router/views";

function addPath(ele, first) {
  const menu = webiste.menu;
  const propsConfig = menu.props;
  const propsDefault = {
    label: propsConfig.label || "name",
    path: propsConfig.path || "path",
    icon: propsConfig.icon || "icon",
    children: propsConfig.children || "children",
  };
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild =
    ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
  if (!isChild) ele[propsDefault.children] = [];
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path] + "/index";
  } else {
    ele[propsDefault.children].forEach((child) => {
      addPath(child);
    });
  }
}

const user = {
  state: {
    userInfo: {},
    permissions: {},
    roles: [],
    menuAll: [],
    menu:
      getStore({
        name: "menu",
      }) || [],
    expires_in:
      getStore({
        name: "expires_in",
      }) || "",
    access_token:
      getStore({
        name: "access_token",
      }) || "",
    refresh_token:
      getStore({
        name: "refresh_token",
      }) || "",
  },
  actions: {
    // 根据用户名登录
    LoginByUsername({ commit }, userInfo) {
      const user = encryption({
        data: userInfo,
        key: "thanks,pig4cloud",
        param: ["password"],
      });
      return new Promise((resolve, reject) => {
        loginByUsername(
          user.username,
          user.password,
          user.code,
          user.randomStr,
          user.useGoogleValid
        )
          .then((response) => {
            const data = response.data.data;
            commit("SET_ACCESS_TOKEN", data.access_token);
            commit("SET_REFRESH_TOKEN", data.refresh_token);
            commit("SET_EXPIRES_IN", data.expires_in);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            const data = res.data.data || {};
            commit("SET_USER_INFO", data);
            commit("SET_ROLES", data.roles || []);
            commit("SET_PERMISSIONS", data.authorities || []);
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    // 刷新token
    RefreshToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        refreshToken(state.refresh_token)
          .then((response) => {
            const data = response.data?.data;
            commit("SET_ACCESS_TOKEN", data.access_token);
            commit("SET_REFRESH_TOKEN", data.refresh_token);
            commit("SET_EXPIRES_IN", data.expires_in);
            commit("REMOVE_LOCK");
            commit("REMOVE_LOCK_PASSWD");
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit("SET_MENU", []);
            commit("SET_PERMISSIONS", []);
            commit("SET_USER_INFO", {});
            commit("SET_ACCESS_TOKEN", "");
            commit("SET_REFRESH_TOKEN", "");
            commit("SET_EXPIRES_IN", "");
            commit("SET_ROLES", []);
            commit("DEL_ALL_TAG");
            commit("REMOVE_LOCK");
            commit("REMOVE_LOCK_PASSWD");
            commit("CLEAER_SESSION");
            store.state.common.lockPasswd = "";
            resolve();
            window.location.reload();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 注销session
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit("SET_MENU", []);
        commit("SET_PERMISSIONS", []);
        commit("SET_USER_INFO", {});
        commit("SET_ACCESS_TOKEN", "");
        commit("SET_REFRESH_TOKEN", "");
        commit("SET_ROLES", []);
        commit("DEL_ALL_TAG");
        commit("REMOVE_LOCK");
        commit("REMOVE_LOCK_PASSWD");
        commit("CLEAER_SESSION");
        resolve();
      });
    },
    // 获取系统菜单
    GetMenu({ commit }, obj) {
      return new Promise((resolve) => {
        getMenu(obj.id).then((res) => {
          const data = res.data.data;
          let list = deepClone(data);
          // const fun = (arr, routerList) => {
          //   arr.forEach((v, i) => {
          //     const item = routerList.find((m) => m.path === v.path);
          //     if (!item?.path || (item?.children && !item?.children.length)) {
          //       arr.splice(i, 1);
          //     }
          //     if (
          //       Array.isArray(v?.children) &&
          //       v?.children.length &&
          //       Array.isArray(item?.children) &&
          //       item?.children.length
          //     ) {
          //       fun(v.children, item.children);
          //     }
          //   });
          //   return arr;
          // };
          // fun(list, routeList);
          let menu = list.filter((v) =>
            routeList.find((m) => m.path === v.path)
          );
          // console.log("routeList=",routeList);
          // window.routeList = routeList
          // window.list = list
          // window.fun = fun
          // let menu = fun(window.list, window.routeList);
          // menu.some(v=>v.path === "/cpadmin")
          // menu.some(v=>v.path === "/dataBoard/index")
          // menu.forEach((v) => {
          //   if (v.path === "/cpadmin") {
          //     arr.splice(i, 1);
          //   }
          // });

          menu.forEach((ele) => {
            addPath(ele);
          });

          const myRouteList = [];
          data.forEach((v) => {
            const item = {
              path: v.path,
              component: "Layout",
              children: [],
            };

            if (v.children && v.children.length) {
              v.children.forEach((m) => {
                item.children.push({
                  path: m.path,
                  name: m.name, //内容管理/视屏管理/视频编辑
                  component: `() =>import(/* webpackChunkName: "views" */ "@/views${m.path}")`,
                });
              });
            } else {
              item.children.push({
                path: v.path,
                name: v.name, //内容管理/视屏管理/视频编辑
                component: `() =>import(/* webpackChunkName: "views" */ "@/views${v.path}")`,
              });
            }
            myRouteList.push(item);
          });
          commit("SET_MENU", { type: obj.type, menu });
          commit("SET_MENU_ALL", { menu: myRouteList });

          resolve(menu);
        });
      });
    },
  },
  mutations: {
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token;
      setStore({
        name: "access_token",
        content: state.access_token,
        type: "session",
      });
    },
    SET_EXPIRES_IN: (state, expires_in) => {
      state.expires_in = expires_in;
      setStore({
        name: "expires_in",
        content: state.expires_in,
        type: "session",
      });
    },
    SET_REFRESH_TOKEN: (state, rfToken) => {
      state.refresh_token = rfToken;
      setStore({
        name: "refresh_token",
        content: state.refresh_token,
        type: "session",
      });
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_MENU: (state, params = {}) => {
      let { menu, type } = params;
      if (type !== false) state.menu = menu;
      setStore({
        name: "menu",
        content: menu,
        type: "session",
      });
    },
    SET_MENU_ALL: (state, params = {}) => {
      let { menu } = params;
      state.menuAll = menu;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
      const list = {};
      for (let i = 0; i < permissions.length; i++) {
        list[permissions[i].authority] = true;
      }
      state.permissions = list;
    },
    REMOVE_LOCK: () => {
      removeStore({
        name: "isLock",
        type: "session",
      });
    },
    REMOVE_LOCK_PASSWD: () => {
      removeStore({
        name: "lockPasswd",
        type: "session",
      });
    },
    CLEAER_SESSION: () => {
      clearStore({
        type: "session",
      });
    },
  },
};
export default user;
