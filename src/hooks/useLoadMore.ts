import { Ref } from 'vue'
export default function useLoadMore(element: Ref<null | HTMLElement>, fn: function) {
  function loadMore() {
    //获取可视区域的高度
    const containerHeight = element.value?.clientHeight || 0
    // 滚动条卷上去的高度 → 滚上去多少
    const scrollTop = element.value?.scrollTop || 0
    // 总高度 → 盒子内容的全部高度（包括看不见的）
    const scrollHeight = element.value?.scrollHeight || 0

    if (containerHeight + scrollTop + 10 >= scrollHeight) {
      fn()
    }
  }
  element.value?.addEventListener('scroll', loadMore)
}
