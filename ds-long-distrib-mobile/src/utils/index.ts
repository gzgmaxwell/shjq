import * as CryptoJS from 'crypto-js'

export const encryption = (params: any) => {
  const { data, type, param, key } = params
  const result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach((ele: string) => {
      result[ele] = btoa(result[ele])
    })
  } else {
    param.forEach((ele: string) => {
      const mykey = CryptoJS.enc.Latin1.parse(key)
      const encrypted = CryptoJS.AES.encrypt(result[ele], mykey, {
        iv: mykey,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      })
      result[ele] = encrypted.toString()
    })
  }
  return result
}

/**
 * Check if an element has a class
 * @param {HTMLElement} ele
 * @param {string} cls
 * @returns {boolean}
 */
export const hasClass = (ele: HTMLElement, cls: string) => {
  return !!ele.className.match(new RegExp(`(\\s|^)${cls}(\\s|$)`))
}

/**
 * Add class to element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export const addClass = (ele: HTMLElement, cls: string) => {
  if (!hasClass(ele, cls)) ele.className += ` ${cls}`
}

/**
 * Remove class from element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export const removeClass = (ele: HTMLElement, cls: string) => {
  if (hasClass(ele, cls)) {
    const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`)
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export const isExternal = (path: string) => {
  const external = /^(https?:|http?:|mailto:|tel:)/.test(path)
  return external
}
