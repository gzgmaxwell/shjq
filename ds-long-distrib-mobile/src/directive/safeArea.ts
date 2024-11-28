import type { Directive, DirectiveBinding } from 'vue'

/*
    刘海屏安全区域快捷指令

    •设置参数为：top，bottom
    •自动判断是否启用安全区域；
    •自动插入安全区域占位和class，注意插入的占位dom是否会影响布局
*/
export const safeArea: Directive = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    const safeAreaDom: HTMLElement = document.createElement('div')

    if (binding.arg === 'top') {
      // 顶部安全区域
      el.classList.add('safe-area-top')
      safeAreaDom.classList.add('safe-area-sapce')
      safeAreaDom.style.height = '2rem'
      el.prepend(safeAreaDom)
    } else if (binding.arg === 'bottom') {
      // 底部安全区域
      el.classList.add('safe-area-bottom')
      safeAreaDom.classList.add('safe-area-sapce')
      safeAreaDom.style.height = '1rem'
      el.append(safeAreaDom)
    } else {
      // 只是单纯加入标识class，自定义操作
      el.classList.add('safe-area')
    }
  }
}
