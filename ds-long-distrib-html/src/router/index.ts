import { createRouter, createWebHashHistory } from "vue-router";

export const Layout = () => import("@/layout/index.vue");

export const dynamicRouter = [
  {
    component: Layout,
    path: "/agentdataboard",
    meta: {
      title: "看板",
      langKey: "/agentdataboard",
      icon: "system",
      hidden: false,
      roles: ["ADMIN"],
      keepAlive: true,
    },
    children: [
      {
        component: () => import("@/views/agentdataboard/home/index.vue"),
        path: "/agentdataboard/home/index",
        meta: {
          title: "看板",
          langKey: "/agentdataboard/home/index",
          icon: "system",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },
  {
    component: Layout,
    path: "/channelDashboard",
    meta: {
      title: "渠道商仪表盘",
      langKey: "/channelDashboard",
      icon: "system",
      hidden: false,
      roles: ["ADMIN"],
      keepAlive: true,
    },
    children: [
      {
        component: () => import("@/views/channelDashboard/home/index.vue"),
        path: "/channelDashboard/home/index",
        meta: {
          title: "仪表盘",
          langKey: "/channelDashboard/home/index",
          icon: "system",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },
  {
    component: Layout,
    path: "/agent-manage",
    meta: {
      title: "代理管理",
      langKey: "/agent-manage",
      icon: "system",
      hidden: false,
      roles: ["ADMIN"],
      keepAlive: true,
    },
    children: [
      {
        component: () => import("@/views/agent-manage/agent-list/index.vue"),
        path: "/agent-manage/agent-list/index",
        meta: {
          title: "代理列表",
          langKey: "/agent-manage/agent-list/index",
          icon: "system",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },
  {
    component: Layout,
    path: "/cpsetting",
    meta: {
      title: "系统设置",
      langKey: "/cpsetting",
      icon: "system",
      hidden: false,
      roles: ["ADMIN"],
      keepAlive: true,
    },
    children: [
      {
        component: () => import("@/views/cpsetting/securitysetting/index.vue"),
        path: "/cpsetting/securitysetting/index",
        meta: {
          title: "安全设置",
          langKey: "/cpsetting/securitysetting/index",
          icon: "system",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        component: () => import("@/views/cpsetting/message/index.vue"),
        path: "/cpsetting/message/index",
        meta: {
          title: "消息信息",
          langKey: "/cpsetting/message/index",
          icon: "system",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },
  {
    component: Layout,
    path: "/cpadmin",
    meta: {
      title: "渠道商权限管理",
      langKey: "/cpadmin",
      icon: "system",
      hidden: false,
      roles: ["ADMIN"],
      keepAlive: true,
    },
    children: [
      {
        component: () => import("@/views/cpadmin/securityCenter/index.vue"),
        path: "/cpadmin/securityCenter/index",
        meta: {
          title: "安全中心",
          langKey: "/cpadmin/securityCenter/index",
          icon: "system",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },
];
// 静态路由
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "首页", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
        meta: {
          title: "首页",
          langKey: "dashboard",
          icon: "homepage",
          affix: true,
          keepAlive: true,
          hidden: true, // 隐藏菜单栏
        },
      },
      {
        path: "401",
        component: () => import("@/views/error-page/401.vue"),
        meta: { hidden: true },
      },
      {
        path: "404",
        component: () => import("@/views/error-page/404.vue"),
        meta: { hidden: true },
      },
    ],
  },
  {
    path: "/agent-manage",
    component: Layout,
    children: [
      {
        path: "/common/user/index",
        component: () => import("@/views/common/user/index.vue"),
        name: "",
        meta: {
          title: "用户列表",
          langKey: "userList",
          icon: "homepage",
          affix: true,
          keepAlive: true,
          hidden: true,
        },
      },
      {
        path: "/common/disProject/index",
        component: () => import("@/views/common/disProject/index.vue"),
        name: "",
        meta: {
          title: "下级渠道项目",
          langKey: "userList",
          icon: "homepage",
          affix: true,
          keepAlive: true,
          hidden: true,
        },
      },
      {
        path: "/common/agentDataStatistics/index",
        component: () => import("@/views/common/agentDataStatistics/index.vue"),
        name: "",
        meta: {
          title: "渠道商数据统计",
          langKey: "userList",
          icon: "homepage",
          affix: true,
          keepAlive: true,
          hidden: true,
        },
      },
      {
        path: "/common/user/details",
        component: () => import("@/views/common/user/details.vue"),
        name: "",
        meta: {
          title: "用户详情",
          langKey: "userDetails",
          icon: "homepage",
          affix: true,
          keepAlive: true,
          hidden: true,
        },
      },
      {
        path: "/common/agentDetails/tabDis",
        component: () => import("@/views/common/agentDetails/tabDis.vue"),
        name: "",
        meta: {
          title: "查看",
          langKey: "userDetails",
          icon: "homepage",
          affix: true,
          keepAlive: true,
          hidden: true,
        },
      },
      {
        path: "/common/agentDetails/tabStation",
        component: () => import("@/views/common/agentDetails/tabStation.vue"),
        name: "",
        meta: {
          title: "查看",
          langKey: "userDetails",
          icon: "homepage",
          affix: true,
          keepAlive: true,
          hidden: true,
        },
      },
    ],
  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
  location.reload();
}

export default router;
