/*
  阻止双指快速点击放大
  对于需要快速点击的元素，在dom上加入：fast-click
*/

export default class PreventTouchZoom {
  static lastTouchEnd = 0

  static bindPreventTouchZoom() {
    document.documentElement.addEventListener(
      'touchend',
      event => {
        const now = Date.now()
        const fastClickTarget = (event.target as HTMLElement).getAttribute('fast-click') === null

        if (now - PreventTouchZoom.lastTouchEnd <= 300 && fastClickTarget) {
          event.preventDefault()
        }

        PreventTouchZoom.lastTouchEnd = now
      },
      false
    )
  }

  static load() {
    PreventTouchZoom.bindPreventTouchZoom()
    document.addEventListener('gesturestart', event => {
      event.preventDefault()
    })
  }
}
