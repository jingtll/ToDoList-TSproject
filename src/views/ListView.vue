<script setup lang="ts">
// import { getNotes } from '@/api/node'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import type { Note, NoteList, NoteListState } from '@/types'
import { useListStore } from '@/stores/notelist'
import { debounce } from '@/utils/debounce'
import useLoadMore from '@/hooks/useLoadMore'
import useLongTouch from '@/hooks/useLongTouch'
import { useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'
const router = useRouter()
const listStore = useListStore()
const notes = ref([] as NoteList)
const items = ref([] as HTMLElement[])
const refListBox = ref<null | HTMLElement>(null)
const initList = () => {
  // getNotes<NoteList>(1, 10).then((res) => {
  //   console.log(res)
  //   notes.value = res
  // })
  listStore.getNotesList(stateV.page, stateV.size).then((res) => (notes.value = res))
}
const noteListState: NoteListState = {
  leftList: [],
  rightList: [],
}
const state = reactive(noteListState)
const initLRlist = () => {
  let leftHeightSum = 0
  let rightHeightSum = 0
  const leftArr: Note[] = []
  const rightArr: Note[] = []
  nextTick(() => {
    console.log(items.value)
    items.value!.forEach((item, index) => {
      if (leftHeightSum <= rightHeightSum) {
        //哪边高度低，就放在哪边
        leftArr.push(notes.value[index])
        leftHeightSum += item?.clientHeight
      } else {
        rightArr.push(notes.value[index])
        rightHeightSum += item?.clientHeight
      }
    })
    state.leftList = leftArr.reverse()
    state.rightList = rightArr.reverse()
  })
}
//存储搜索数据
const stateV = reactive({
  searchValue: '',
  page: 1,
  size: 13,
  delId: '',
})
//定义搜索方法
const handleSearch = () => {
  if (stateV.searchValue.trim() === '') {
    handleClear()
  } else {
    listStore
      .getNotesListSearch(stateV.searchValue)
      .then((res) => ((items.value = []), (notes.value = res)))
  }
}

//定义清除搜索
const handleClear = () => {
  listStore
    .getNotesList(stateV.page, stateV.size)
    .then((res) => ((items.value = []), (notes.value = res)))
}
//分页请求
const loadMore = () => {
  stateV.page++
  listStore
    .getNotesList(stateV.page, stateV.size)
    .then((res) => ((items.value = []), (notes.value = res)))
}
//定义添加便签跳转
const handleAdd = () => {
  router.push({ name: 'addNote' })
}
//点击跳转便签详情页
const handleClickItem = (e: any) => {
  console.log(e.target.id)
  if (e.target.className === 'click-model') {
    const id = e.target.id
    router.push({ path: '/addNote', query: { id } })
  }
}
//处理长按删除的功能
const show = ref<boolean>(false)
const leftDom = ref<null | HTMLElement>(null)
const rightDom = ref<null | HTMLElement>(null)
useLongTouch([leftDom, rightDom], (id: string) => {
  //拿到id值以后，调用删除的接口，进行删除的操作，删除dom的显示
  console.log(id, '长按了')
  stateV.delId = id
  show.value = true
})
//定义删除便签函数
const handleDelete = () => {
  listStore.deleteNoteList(stateV.delId).then((res) => {
    if (res) {
      showSuccessToast('删除成功')
      show.value = false
      handleClear()
    }
  })
}
onMounted(() => {
  initList()
  useLoadMore(refListBox, loadMore)
})
watch(notes, () => {
  initLRlist()
})
watch(() => stateV.searchValue, debounce(handleSearch, 1000))
</script>

<template>
  <div class="note-box">
    <van-search
      placeholder="搜索便签"
      input-align="center"
      v-model="stateV.searchValue"
      @search="handleSearch"
      @clear="handleClear"
    />
    <div class="list-box" ref="refListBox">
      <div class="list-left" @click="handleClickItem" ref="leftDom">
        <div v-for="item in state.leftList" :key="item['_id']" class="list-item">
          <div class="item-content">
            <p class="item-text">{{ item.content }}</p>
          </div>
          <div class="item-bottom">
            <p>{{ item.dates }}</p>
          </div>
          <div class="click-model" :id="item['_id']"></div>
        </div>
      </div>
      <div class="list-right" @click="handleClickItem" ref="rightDom">
        <div v-for="item in state.rightList" :key="item['_id']" class="list-item">
          <div class="item-content">
            <p class="item-text">{{ item.content }}</p>
          </div>
          <div class="item-bottom">
            <p>{{ item.dates }}</p>
            <div class="click-model" :id="item['_id']"></div>
          </div>
        </div>
      </div>
      <div class="init-list">
        <div
          v-for="item in notes"
          :key="item['_id']"
          class="list-item"
          :ref="
            (el) => {
              if (el != null) {
                items.push(el as HTMLElement)
              }
            }
          "
        >
          <div class="item-content">
            <p class="item-text">{{ item.content }}</p>
          </div>
          <div class="item-bottom">
            <p>{{ item.dates }}</p>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model:show="show" position="bottom" :style="{ height: '10%' }"
      ><div
        @click="handleDelete"
        class="h-full w-full flex items-center justify-center text-center text-blue-500 delete-text"
      >
        删除
      </div></van-popup
    >
    <van-button round icon="plus" class="button" type="primary" @click="handleAdd"></van-button>
  </div>
</template>
<style lang="scss" scoped>
.note-box {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  flex: 1;
  padding: 0 0.1rem;
  box-sizing: border-box;
  .van-search {
    :v-deep(.van-search__content) {
      background-color: rgb(247, 247, 247);
      border-radius: 0.2rem;
    }
    background-color: rgb(247, 247, 247);
  }
  .list-box {
    width: 100%;
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      /* 滚动条宽 */
      display: none;
    }
    &::-webkit-scrollbar-thumb {
      /* 滚动条 拖动条 */
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 6px;
    }
    &::-webkit-scrollbar-track {
      /* 滚动条背景槽 */
      background-color: #eee;
      border-radius: 6px;
    }
    .list-left {
      width: 50%;
      float: left;
      padding-bottom: 50px;
      padding-left: 5px;
    }
    .list-right {
      width: 50%;
      float: left;
      display: flex;
      flex-flow: column wrap;
      align-items: flex-end;
      padding-bottom: 50px;
      padding-right: 5px;
    }
    .init-list {
      width: 50%;
      /* background-color: rgb(122, 129, 127); */
      position: absolute;
      visibility: hidden;
      height: 2rem;
      overflow: hidden;
    }
    .list-item {
      box-sizing: border-box;
      width: 95%;
      max-height: 2rem;
      background-color: rgb(245, 245, 245);
      border-radius: 0.15rem;
      margin-top: 0.1rem;
      padding: 0.2rem;
      position: relative;
      box-shadow: 2px 2px 9px #ccc;
      .item-content {
        max-height: 1.25rem;
        font-size: 0.16rem;
        line-height: 0.25rem;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        color: rgb(99, 99, 99);
        .item-text:first-line {
          color: rgb(27, 27, 27);
          font-weight: 600;
        }
      }
      .item-bottom {
        height: 0.35rem;
        color: rgb(151, 151, 151);
        display: flex;
        align-items: flex-end;
      }
      .click-model {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    }
  }
  .van-popup {
    :deep(.van-popup__content) {
      width: 100%;
      height: 100%;
    }
  }
  .delete-text {
    font-size: 0.23rem;
  }
  .button {
    position: fixed;
    bottom: 0.2rem;
    right: 0.2rem;
  }
  .van-button {
    width: 0.44rem;
    height: 0.44rem;
  }
}
</style>
