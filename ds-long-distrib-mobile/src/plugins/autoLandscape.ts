import '@/styles/landscape/index.less'
import { useAppStore } from '@/stores/app'
import { useDebounce } from '@/hooks'
/*
  自适应横屏模式
  通过css将body旋转，达到兼容
*/

export default class NoRotationPlugin {
  private static bind() {
    const { changeLandscape } = useAppStore()
    // 如果宽高比大于13/9的话，显示这个内容
    const screenDirction = window.matchMedia('(min-aspect-ratio: 1/1)')

    if (screenDirction.matches) {
      document.documentElement.classList.add('landscape')
      changeLandscape(true)
    } else {
      document.documentElement.classList.remove('landscape')
      changeLandscape(false)
    }
  }

  static load() {
    NoRotationPlugin.bind()
    window.addEventListener('resize', useDebounce(NoRotationPlugin.bind, 10))
  }
}
