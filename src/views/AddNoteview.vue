<script setup lang="ts">
import { reactive } from 'vue'
import { useListStore } from '@/stores/notelist'
import { showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
const router = useRouter()
const listStore = useListStore()
const state = reactive({
  note: {
    content: '',
    dates: '',
  },
})
const date = new Date()
const handleAddNotes = () => {
  state.note.dates = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  listStore.addNoteList(state.note).then((res) => {
    if (res) {
      showSuccessToast('添加成功')
      router.push('/')
    }
  })
}
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
