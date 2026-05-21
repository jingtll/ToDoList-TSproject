<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useListStore } from '@/stores/notelist'
import { showSuccessToast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()
const router = useRouter()
const listStore = useListStore()
const state = reactive({
  note: {
    content: '',
    dates: '',
  },
  oldContent: '',
  id: '',
})
const date = new Date()
const handleAddNotes = () => {
  if (state.id) {
    if (state.oldContent != state.note.content) {
      const payLoad = { id: state.id, note: state.note }
      listStore.updateNoteList(payLoad).then((res) => {
        if (res) {
          showSuccessToast('更新成功')
          router.push('/')
        }
      })
    }
  } else {
    state.note.dates = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    listStore.addNoteList(state.note).then((res) => {
      if (res) {
        showSuccessToast('添加成功')
        router.push('/')
      }
    })
  }
}
const initNote = () => {
  const id = route.query.id
  if (!id) return
  listStore.list.forEach((item) => {
    if (item._id == id) {
      state.note.content = item.content
      state.oldContent = item.content
      state.id = item._id
    }
  })
}
onMounted(() => {
  initNote()
})
</script>

<template>
  <div class="add-note-box w-full overflow-x-hidden overflow-y-auto bg-amber-50 flex-1">
    <van-nav-bar left-arrow
      ><template #right><van-icon name="success" size="18" @click="handleAddNotes()" /></template
    ></van-nav-bar>
    <van-field
      v-model="state.note.content"
      class="field text-xl"
      rows="1"
      autosize
      type="textarea"
      placeholder="请输入内容"
    ></van-field>
  </div>
</template>

<style lang="scss" scoped></style>
