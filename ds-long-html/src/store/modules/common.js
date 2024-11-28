import { getStore, removeStore, setStore } from "@/util/store";
import website from "@/const/website";
import {
  dictionaryQueryListByKeys,
  getReferralLevel,
  getBindStatusByUsername,
  classifyWebList,
} from "@/api/common";

import { curriculum } from "@/api/content/classify";
import {
  deptUserTree,
  messageQueryPage,
  extSettingGet,
  tenant_getByUser,
} from "@/api/admin/index";

const common = {
  state: {
    isCollapse: false,
    isFullScreen: false,
    isShade: false,
    screen: -1,
    isLock: getStore({ name: "isLock" }) || false,
    showTag: true,
    showCollapse: true,
    showFullScren: true,
    website: website,
    lockPasswd:
      getStore({
        name: "lockPasswd",
      }) || "",
    dictionary: getStore({ name: "dictionary" }) || {},
    lang: getStore({ name: "lang" }) || "zh-cn",
    classifyOptions: getStore({ name: "classifyOptions" }) || [],
    levelData: getStore({ name: "levelData" }) || [],
    googleAuth: getStore({ name: "googleAuth" }) || {},
    adminTag: getStore({ name: "adminTag" }) || [],
    department: getStore({ name: "department" }) || [],
    warningInfo: getStore({ name: "warningInfo" }) || {},
    warningTime: getStore({ name: "warningTime" }) || {},
    busPlatformInfo: getStore({ name: "busPlatformInfo" }) || {},
  },
  actions: {},
  mutations: {
    SET_SHADE: (state, active) => {
      state.isShade = active;
    },
    SET_COLLAPSE: (state) => {
      state.isCollapse = !state.isCollapse;
    },
    SET_FULLSCREN: (state) => {
      state.isFullScreen = !state.isFullScreen;
    },
    SET_SHOWCOLLAPSE: (state, active) => {
      state.showCollapse = active;
      setStore({
        name: "showCollapse",
        content: state.showCollapse,
      });
    },
    SET_SHOWTAG: (state, active) => {
      state.showTag = active;
      setStore({
        name: "showTag",
        content: state.showTag,
      });
    },
    SET_SHOWMENU: (state, active) => {
      state.showMenu = active;
      setStore({
        name: "showMenu",
        content: state.showMenu,
      });
    },
    SET_SHOWLOCK: (state, active) => {
      state.showLock = active;
      setStore({
        name: "showLock",
        content: state.showLock,
      });
    },
    SET_SHOWSEARCH: (state, active) => {
      state.showSearch = active;
      setStore({
        name: "showSearch",
        content: state.showSearch,
      });
    },
    SET_SHOWFULLSCREN: (state, active) => {
      state.showFullScren = active;
      setStore({
        name: "showFullScren",
        content: state.showFullScren,
      });
    },
    SET_SHOWDEBUG: (state, active) => {
      state.showDebug = active;
      setStore({
        name: "showDebug",
        content: state.showDebug,
      });
    },
    SET_SHOWTHEME: (state, active) => {
      state.showTheme = active;
      setStore({
        name: "showTheme",
        content: state.showTheme,
      });
    },
    SET_SHOWCOLOR: (state, active) => {
      state.showColor = active;
      setStore({
        name: "showColor",
        content: state.showColor,
      });
    },
    SET_LOCK: (state) => {
      state.isLock = true;
      setStore({
        name: "isLock",
        content: state.isLock,
        type: "session",
      });
    },
    SET_SCREEN: (state, screen) => {
      state.screen = screen;
    },
    SET_THEME: (state, color) => {
      state.theme = color;
      setStore({
        name: "theme",
        content: state.theme,
      });
    },
    SET_THEME_NAME: (state, themeName) => {
      state.themeName = themeName;
      setStore({
        name: "themeName",
        content: state.themeName,
      });
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd;
      setStore({
        name: "lockPasswd",
        content: state.lockPasswd,
        type: "session",
      });
    },
    CLEAR_LOCK: (state) => {
      state.isLock = false;
      state.lockPasswd = "";
      removeStore({
        name: "lockPasswd",
        type: "session",
      });
      removeStore({
        name: "isLock",
        type: "session",
      });
    },
    SET_DICTIONARY: (state, dictionary) => {
      state.dictionary = dictionary;
      setStore({
        name: "dictionary",
        content: state.dictionary,
      });
    },
    SET_GOOGLEAUTH: (state, data) => {
      state.googleAuth = data;
      setStore({
        name: "googleAuth",
        content: state.googleAuth,
      });
    },
    SET_LANG: (state, lang) => {
      state.lang = lang;
      setStore({
        name: "lang",
        content: state.lang,
      });
    },
    SET_CLASSIFY: (state, classifyOptions) => {
      state.classifyOptions = classifyOptions;
      setStore({
        name: "classifyOptions",
        content: state.classifyOptions,
      });
    },
    SET_LEVEL: (state, levelData) => {
      state.levelData = levelData;
      setStore({
        name: "levelData",
        content: state.levelData,
      });
    },
    SET_ADMINTAG: (state, data) => {
      state.adminTag = data;
      setStore({
        name: "adminTag",
        content: state.adminTag,
      });
    },
    SET_DEPARTMENT: (state, data) => {
      state.department = data;
      setStore({
        name: "department",
        content: state.department,
      });
    },
    SET_warningInfo: (state, data) => {
      state.warningInfo = data;
      setStore({
        name: "warningInfo",
        content: state.warningInfo,
      });
    },
    SET_warningTime: (state, data) => {
      state.warningTime = data;
      setStore({
        name: "warningTime",
        content: state.warningTime,
      });
    },
    SET_busPlatformInfo: (state, data) => {
      state.busPlatformInfo = data;
      setStore({
        name: "busPlatformInfo",
        content: state.busPlatformInfo,
      });
    },
  },
  actions: {
    actionDictionary({ commit }) {
      const params = {
        current: 1,
        dictionaryKeys: [],
        size: 999,
      };
      dictionaryQueryListByKeys(params).then((res) => {
        commit("SET_DICTIONARY", res.data.data);
      });
    },

    actionGetBingStatus({ commit }, params) {
      return getBindStatusByUsername(params.username).then((res) => {
        commit("SET_GOOGLEAUTH", res.data.data);
        return Promise.resolve(res);
      });
    },
    actionClassify({ commit }) {
      let params = {
        current: 1,
        size: 1000,
      };
      return curriculum(params).then((res) => {
        const item = res.data.data.records;
        commit("SET_CLASSIFY", item);
        return Promise.resolve();
      });
    },
    getLevel({ commit }) {
      return getReferralLevel().then((res) => {
        commit("SET_LEVEL", res.data.data);
        return Promise.resolve(res);
      });
    },
    actionAdminTag({ commit }) {
      return classifyWebList().then((res) => {
        const data = res.data.data || [];
        commit("SET_ADMINTAG", data);
        return Promise.resolve(res);
      });
    },
    actionDepartment({ commit }) {
      const params = {
        current: 1,
        size: 999,
      };
      return deptUserTree(params).then((res) => {
        const data = res.data.data || [];
        commit("SET_DEPARTMENT", data);
        return Promise.resolve(res);
      });
    },
    actionWarningInfo({ commit }, data) {
      let params;
      if (data) {
        const { current, size } = data;
        params = {
          current,
          size,
        };
      } else {
        params = {
          current: 1,
          size: 10,
        };
      }
      return messageQueryPage(params).then((res) => {
        commit("SET_warningInfo", res);
        return Promise.resolve(res);
      });
    },
    actionWarningTime({ commit }) {
      return extSettingGet().then((res) => {
        commit("SET_warningTime", res);
        return Promise.resolve(res);
      });
    },
    actionGetByUser({ commit }) {
      return tenant_getByUser().then((res) => {
        localStorage.setItem("BusPlatformId", res.data.data.busPlatformId);
        commit("SET_busPlatformInfo", res.data.data);
        return Promise.resolve(res);
      });
    },
  },
};
export default common;
