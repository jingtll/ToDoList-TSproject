//长按函数
import type { Ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'
export default function (arr: Ref<null | HTMLElement>[], callbacks: Function) {
  let timer: number | null = null
  let isMoving = false
  const touchStart = (e: any) => {
    const id = e.targetTouches[0].target.id
    // ① e触摸事件对象，包含所有触摸信息
    // ② targetTouches当前屏幕上所有正在触摸的手指列表是一个数组
    // ③ targetTouches[0] 第一根手指（你当前按下去的那根）的信息
    // ④ .target你手指按到的那个 DOM 元素（HTML 标签）
    // ⑤ .id拿到这个元素的 id 属性
    // 整句意思：拿到你长按的那个元素的 id
    timer = setTimeout(() => {
      if (!isMoving) {
        callbacks(id)
      }
    }, 1000)
  }
  const touchEnd = () => {
    clearTimeout(timer as number)
    isMoving = false
  }
  const touchMove = () => {
    isMoving = true
  }
  onMounted(() => {
    arr.forEach((item) => {
      item.value?.addEventListener('touchstart', touchStart)
      item.value?.addEventListener('touchend', touchEnd)
      item.value?.addEventListener('touchmove', touchMove)
    })
  })
  onUnmounted(() => {
    arr.forEach((item) => {
      item.value?.removeEventListener('touchstart', touchStart)
      item.value?.removeEventListener('touchend', touchEnd)
      item.value?.removeEventListener('touchmove', touchMove)
    })
  })
}
