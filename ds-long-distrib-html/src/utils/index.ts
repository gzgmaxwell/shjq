import * as CryptoJS from "crypto-js";

export const encryption = (params: any) => {
  const { data, type, param, key } = params;
  const result = JSON.parse(JSON.stringify(data));
  if (type === "Base64") {
    param.forEach((ele: string) => {
      result[ele] = btoa(result[ele]);
    });
  } else {
    param.forEach((ele: string) => {
      const data = result[ele];
      const mykey = CryptoJS.enc.Latin1.parse(key);
      const encrypted = CryptoJS.AES.encrypt(data, mykey, {
        iv: mykey,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding,
      });
      result[ele] = encrypted.toString();
    });
  }
  return result;
};

/**
 * Check if an element has a class
 * @param {HTMLElement} ele
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele: HTMLElement, cls: string) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function addClass(ele: HTMLElement, cls: string) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function removeClass(ele: HTMLElement, cls: string) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path);
  return isExternal;
}

// 处理-----------------------------------------
export const getUserId = () => {
  const userInfo: any = localStorage.getItem("userInfo") || {};
  const userObject = JSON.parse(userInfo) || {};
  const id = userObject.userInfo?.user_info?.id;
  return id;
};

export const getUserInfo = () => {
  const userInfo: any = localStorage.getItem("userInfo") || {};
  const userObject = JSON.parse(userInfo) || {};
  const user_info = userObject.userInfo?.user_info;
  return user_info;
};

export const getUserName = () => {
  const userInfo: any = localStorage.getItem("userInfo") || {};
  const userObject = JSON.parse(userInfo) || {};
  const username = userObject.userInfo?.user_info?.username;
  return username;
};

export const getTimeZone = () => {
  // config.headers["Time-Zone"] = "GMT+08:00";
  const date = new Date().getTimezoneOffset();
  const timezone = -date / 60;
  const str = timezone < 0 ? "-" : "+";
  let newTimezone = "";
  if (Math.abs(timezone) < 10) {
    newTimezone = `${str}0${Math.floor(Math.abs(timezone))}`;
  } else {
    newTimezone = str + Math.floor(Math.abs(timezone));
  }
  const m = Math.abs(date) % 60 > 0 ? Math.abs(date) % 60 : "00";
  return `GMT${newTimezone}:${m}`;
};

export const resetSearchData = (searchData: any) => {
  for (const key in searchData) {
    if (Array.isArray(searchData[key])) {
      searchData[key] = [];
    }
    if (typeof searchData[key] === "string") {
      searchData[key] = "";
    }
  }
};

export const filterNullSearchData = (searchData: any) => {
  const newSearchData = {
    ...searchData,
  };
  for (const key in newSearchData) {
    if (Array.isArray(newSearchData[key]) && key === "dateTime") {
      delete newSearchData[key];
    }
    if (typeof newSearchData[key] === "string" && !newSearchData[key]) {
      delete newSearchData[key];
    }
    if (typeof newSearchData[key] === "number" && !newSearchData[key]) {
      delete newSearchData[key];
    }
    if (newSearchData[key] === null || newSearchData[key] === undefined) {
      delete newSearchData[key];
    }
  }
  return newSearchData;
};

let timercb: any = null;
let isProcessing = false; // 添加一个状态变量
export function debounceCallBack(fn: any, ms = 400) {
  return function () {
    if (timercb) {
      clearTimeout(timercb);
    }
    if (!isProcessing) {
      // 如果上一次操作已经完成，则执行下一次操作
      timercb = setTimeout(() => {
        isProcessing = true; // 将状态变量设置为正在处理
        //  fn.apply(this, arguments)
        fn.apply()
          .then(() => {
            // 在异步操作完成后将状态变量设置为已完成
            isProcessing = false;
          })
          .catch(() => {
            isProcessing = false;
          });
      }, ms);
    }
  };
}
export function pageHandle(current: any, size: any, total: any) {
  const pageTotal = Math.ceil((total - 1) / size);
  const pageNum = current > pageTotal ? pageTotal : current;
  return pageNum < 1 ? 1 : pageNum;
}
