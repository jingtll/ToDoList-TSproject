// 节流函数
export function throttle(fn: Function, wait: number) {
  let lastTime = 0
  return function (...args: any) {
    const now = Date.now()
    if (now - lastTime > wait) {
      fn(...args)
      lastTime = now
    }
  }
}
