/*
  自适应屏幕模式
  自动设置根元素fontsize大小
  始终保持1rem = 16px
*/
import { useDebounce } from '@/hooks'

export default class AutoSetRootFontPlugin {
  private static bind() {
    const doc = document.documentElement
    let width = doc.clientWidth

    // 是否启用横屏兼容
    const screenDirction = window.matchMedia('(min-aspect-ratio: 1/1)')
    if (screenDirction.matches) {
      width = doc.clientHeight
    }

    const size = 16 * (width / 375)
    doc.style.fontSize = `${size}px`
  }

  static load() {
    window.addEventListener('resize', useDebounce(AutoSetRootFontPlugin.bind, 100), false)
  }
}
