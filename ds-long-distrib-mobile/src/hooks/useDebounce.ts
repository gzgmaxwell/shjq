export const useDebounce = (fn: Function, delay: number) => {
  let timer: number = 0
  return () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn, delay)
  }
}
