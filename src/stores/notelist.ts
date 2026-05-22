import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Note, NoteList } from '@/types/note'
import {
  getNotes,
  addNotes,
  getNoteListByContent,
  UpdateNote,
  getNoteById,
  deleteNote,
} from '@/api/node'

export const useListStore = defineStore('list', () => {
  const list = ref<Note[]>([])

  const getNotesList = async (page: number, size: number) => {
    const res = await getNotes<NoteList>(page, size)
    if (page === 1) {
      list.value = res
    } else {
      list.value.push(...res)
    }
    return [...list.value]
  }
  const addNoteList = async (payload: Note) => {
    return await addNotes<Note>(payload)
  }
  const getNotesListSearch = async (content: string) => {
    const res = await getNoteListByContent<NoteList>(content)
    list.value = res
    return res
  }
  const updateNoteList = async (payload: any) => {
    return await UpdateNote<Note>(payload.id, payload.note)
  }
  const getNoteByIdList = async (id: string) => {
    return await getNoteById<Note>(id)
  }
  const deleteNoteList = async (id: string) => {
    return await deleteNote<Note>(id)
  }
  return {
    list,
    getNotesList,
    addNoteList,
    getNotesListSearch,
    updateNoteList,
    getNoteByIdList,
    deleteNoteList,
  }
})
