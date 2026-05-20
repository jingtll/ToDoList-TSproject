// 定义一个防抖工具函数
// fn：要防抖的函数（比如你的搜索函数 handleSearch）
// wait：等待时间，比如 300 毫秒
export function debounce(fn: Function, wait: number) {
  // 定时器 ID（用来存定时器，方便清除）
  let timer: any

  // 返回一个“包装后的新函数”
  return function (...args: any) {
    // 1. 如果之前有定时器 → 先清除！
    // 只要你还在打字，就一直清掉旧的定时器
    if (timer) clearTimeout(timer)

    // 2. 新建一个定时器
    // 等 wait 毫秒后，再执行真正的函数 fn
    timer = setTimeout(() => {
      // 执行真正的搜索函数
      fn(args)
      // 执行完清空定时器
      clearTimeout(timer)
    }, wait)
  }
}
